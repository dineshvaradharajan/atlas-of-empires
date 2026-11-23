# Server side: Cloudflare Pages Functions

The site is static (`public/`). The one thing that runs on a server is `api/report.js`: `POST /api/report`, which takes a report from the "Report an issue" panel (`public/report/`) and emails it on through [Resend](https://resend.com). `tools/deploy.sh` publishes it with the site; Cloudflare Pages runs every file under `functions/` as a route.

## Setting it up (once)

1. **Resend account.** Sign up for the free plan at resend.com with the address the reports should go to. Until you verify a domain (step 4), Resend's test sender (`onboarding@resend.dev`) delivers only to the account's own address, and that is all the reports need.
2. **API key.** In Resend, open *API Keys*, then *Create API key*, with permission *Sending access*. Copy it; Resend shows it once.
3. **Tell the Pages project.** In the Cloudflare dashboard, open *Workers & Pages*, then *worldatlas*, then *Settings*, then *Variables and Secrets*. Under *Production*, add two variables of type *Secret*:
   - `RESEND_API_KEY`: the key from step 2
   - `REPORT_TO`: the address reports go to (several can be separated by commas)

   Or from a terminal: `wrangler pages secret put RESEND_API_KEY --project-name=worldatlas`, then the same for `REPORT_TO`.
   The address lives only here. It is never in the page, so it can't be scraped from the site.
4. **Optional: send from the atlas's own domain** (better delivery, and needed to mail anyone other than the Resend account). In Resend, open *Domains*, then *Add domain*, and enter `worldatlas.site`. Add the DNS records it lists (SPF and DKIM) in Cloudflare's DNS for the domain, then wait for Resend to show *Verified*. Then add a plain variable `REPORT_FROM` = `The World Atlas <reports@worldatlas.site>`.
5. **Optional: a firmer rate limit.** The function allows 5 reports per visitor every 10 minutes. Without a KV namespace that count is kept separately on each Cloudflare server, so it is approximate. To make it exact, run `wrangler kv namespace create REPORT_KV`, then in *Settings*, then *Bindings*, add a *KV namespace* binding named `REPORT_KV` that points to it. A Cloudflare WAF rate-limiting rule on the path `/api/report` also works (the free plan includes one rule).
6. **Deploy:** commit, then run `sh tools/deploy.sh`. Variables apply from the next deployment.

## What it checks

- The request must come from the site itself (`Origin`), as JSON, under 24 KB.
- The feedback must be 3 to 4,000 characters. The email is optional but must look like an email.
- If the hidden honeypot field is filled, or the form was sent less than 1.5 s after it opened, the function answers "ok" and sends nothing.
- 5 reports per visitor (by IP) every 10 minutes; past that it answers 429.
- The context the panel sends is limited to known fields, each clipped to 600 characters. Everything is escaped in the HTML email.
- If the reader leaves an email address, it goes in Reply-To, so replying to the email answers them.

## Trying it locally

- `python3 -I tools/serve.py` (the "atlas" launch config) answers `POST /api/report` itself: it prints the report in its log and sends nothing. Start the feedback with `#fail`, `#slow` or `#limit` to see the panel's error, sending and rate-limit states.
- To run the real function without sending email: `wrangler pages dev public --binding REPORT_TO=you@example.com --binding REPORT_DRY_RUN=1`. It logs the email it would send.
