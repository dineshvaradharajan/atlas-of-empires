// POST /api/report: a reader's report (a wrong border, a wrong fact, something broken, a suggestion) from the "Report an issue"
// panel (public/report/report.js), sent on as an email to the atlas's maker through Resend (https://resend.com).
//
// A Cloudflare Pages Function: tools/deploy.sh publishes it with the site. Its settings live in the Pages project
// (Settings > Variables and Secrets), never in the page, so the address it mails to cannot be scraped:
//   RESEND_API_KEY  secret   the Resend API key (a "sending access" key is enough)
//   REPORT_TO       secret   where reports go
//   REPORT_FROM     optional the sender, e.g. "The World Atlas <reports@worldatlas.site>" once the domain is verified in
//                            Resend; without it Resend's test sender is used, which delivers only to the Resend account's own address
//   REPORT_KV       optional a KV namespace binding; with it the limit of reports per visitor holds across Cloudflare's servers
//   REPORT_DRY_RUN  optional "1": log the email instead of sending it (local testing with `wrangler pages dev`)
//
// Abuse protection: same-site requests only, a size limit, a honeypot field, a minimum time to fill the form, and a limit of
// LIMIT reports per visitor (by IP) per WINDOW seconds.

const MAX_BODY = 24 * 1024;        // bytes of JSON accepted
const MAX_TEXT = 4000;             // characters of feedback
const MIN_TEXT = 3;
const MAX_FIELD = 600;             // characters for each context value (the user agent is the longest)
const MIN_FILL_MS = 1500;          // faster than this is a script
const LIMIT = 5, WINDOW = 600;     // 5 reports per 10 minutes per visitor
const TYPES = { border: "Wrong border or date", fact: "Wrong fact or text", broken: "Something broken", idea: "Suggestion" };
const CONTEXT = [ // what the panel may send about the page, in the order the email lists it
  ["page", "Page"], ["section", "Section"], ["time", "Time"], ["year", "Year"], ["period", "Period"], ["focus", "Selected"],
  ["story", "Story"], ["chapter", "Chapter"], ["view", "View"], ["map", "Map"], ["url", "Address"], ["look", "Look"],
  ["viewport", "Viewport"], ["device", "Device"], ["lang", "Language"], ["ua", "Browser"],
];

const json = (status, body, extra = {}) => new Response(JSON.stringify(body), {
  status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...extra },
});
const clip = (v, n) => String(v ?? "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim().slice(0, n);
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const EMAIL = /^[^\s@<>()",;:]{1,64}@[^\s@<>()",;:]{1,190}\.[A-Za-z]{2,}$/;

const memory = new Map(); // per-server fallback for the rate limit when no KV namespace is bound
async function overLimit(env, ip) {
  const slot = Math.floor(Date.now() / 1000 / WINDOW), key = `report:${ip}:${slot}`;
  if (env.REPORT_KV) {
    const n = +(await env.REPORT_KV.get(key)) || 0;
    if (n >= LIMIT) return true;
    await env.REPORT_KV.put(key, String(n + 1), { expirationTtl: WINDOW * 2 });
    return false;
  }
  if (memory.size > 5000) memory.clear();
  const n = memory.get(key) || 0;
  memory.set(key, n + 1);
  return n >= LIMIT;
}

function sameSite(request) {
  const origin = request.headers.get("origin");
  if (!origin) return request.headers.get("sec-fetch-site") !== "cross-site";
  try { const o = new URL(origin), u = new URL(request.url); return o.host === u.host; } catch { return false; }
}

async function handlePost({ request, env }) {
  if (!sameSite(request)) return json(403, { ok: false, error: "forbidden" });
  if (!/^application\/json\b/i.test(request.headers.get("content-type") || "")) return json(415, { ok: false, error: "json-only" });
  const raw = await request.text();
  if (raw.length > MAX_BODY) return json(413, { ok: false, error: "too-large" });
  let b; try { b = JSON.parse(raw); } catch { return json(400, { ok: false, error: "bad-json" }); }
  if (!b || typeof b !== "object") return json(400, { ok: false, error: "bad-json" });

  // a filled honeypot or an instant submit: answer as if it worked, so a bot learns nothing
  if (clip(b.website, 200) || (typeof b.elapsed === "number" && b.elapsed < MIN_FILL_MS)) return json(200, { ok: true });

  const message = clip(b.message, MAX_TEXT + 1);
  if (message.length < MIN_TEXT) return json(422, { ok: false, error: "message-required" });
  if (message.length > MAX_TEXT) return json(422, { ok: false, error: "message-too-long" });
  const email = clip(b.email, 200);
  if (email && !EMAIL.test(email)) return json(422, { ok: false, error: "bad-email" });
  const type = TYPES[b.type] ? b.type : "";
  const ctx = b.context && typeof b.context === "object" ? b.context : null;
  const rows = ctx ? CONTEXT.map(([k, label]) => [label, clip(ctx[k], MAX_FIELD)]).filter(([, v]) => v) : [];

  const ip = request.headers.get("cf-connecting-ip") || "local";
  if (await overLimit(env, ip)) return json(429, { ok: false, error: "rate-limited" }, { "retry-after": String(WINDOW) });

  if (!env.REPORT_TO || (!env.RESEND_API_KEY && env.REPORT_DRY_RUN !== "1")) {
    console.error("report: REPORT_TO or RESEND_API_KEY is not set");
    return json(503, { ok: false, error: "not-configured" });
  }

  const label = TYPES[type] || "Report";
  const where = ctx ? [clip(ctx.year || ctx.time, 60), clip(ctx.focus, 80)].filter(Boolean).join(", ") : "";
  const first = message.split("\n")[0].slice(0, 60);
  const subject = `[Atlas] ${label}${where ? ` · ${where}` : ""}: ${first}${message.length > first.length ? "…" : ""}`;
  const text = [
    `${label}${email ? ` from ${email}` : " (no email given)"}`, "", message, "",
    rows.length ? "Page details" : "The reader removed the page details.",
    ...rows.map(([k, v]) => `${k}: ${v}`), "", `Received ${new Date().toISOString()}`,
  ].join("\n");
  const html = `<div style="font:15px/1.5 -apple-system,Segoe UI,Inter,sans-serif;color:#15211b;max-width:640px">
<p style="margin:0 0 4px;font:600 12px/1.4 sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#c2482e">${esc(label)}</p>
<p style="margin:0 0 16px;color:#586860">${email ? `From <a href="mailto:${esc(email)}">${esc(email)}</a>, reply to answer` : "No email given"}</p>
<div style="white-space:pre-wrap;padding:14px 16px;border:1px solid #d9e3dc;border-radius:10px;background:#fbfdfb">${esc(message)}</div>
${rows.length ? `<table style="margin-top:18px;border-collapse:collapse;font-size:13px">${rows.map(([k, v]) => `<tr><td style="padding:3px 14px 3px 0;color:#586860;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:3px 0;word-break:break-word">${k === "Address" && /^https?:\/\//.test(v) ? `<a href="${esc(v)}">${esc(v)}</a>` : esc(v)}</td></tr>`).join("")}</table>` : `<p style="margin-top:18px;color:#586860;font-size:13px">The reader removed the page details.</p>`}
</div>`;

  const mail = {
    from: env.REPORT_FROM || "The World Atlas <onboarding@resend.dev>",
    to: env.REPORT_TO.split(",").map((s) => s.trim()).filter(Boolean),
    subject: subject.slice(0, 180), text, html,
    ...(email ? { reply_to: email } : {}),
  };
  if (env.REPORT_DRY_RUN === "1") { console.log("report (dry run):", JSON.stringify({ ...mail, to: "[REPORT_TO]", html: undefined }, null, 2)); return json(200, { ok: true, dryRun: true }); }

  let r;
  try {
    r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify(mail),
    });
  } catch (e) { console.error("report: Resend unreachable", e); return json(502, { ok: false, error: "send-failed" }); }
  if (!r.ok) { console.error("report: Resend said", r.status, await r.text().catch(() => "")); return json(502, { ok: false, error: "send-failed" }); }
  return json(200, { ok: true });
}

export const onRequest = (context) => context.request.method === "POST" ? handlePost(context) : json(405, { ok: false, error: "post-only" }, { allow: "POST" });
