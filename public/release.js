/* Scripts and styles from the release this page names.
   tools/deploy.sh stamps the release on the page (meta data-version), on its own scripts and styles (?v=<release>, kept for a
   year) and on every response (X-Release). A deploy takes a minute to reach every Cloudflare server; a page loaded meanwhile can
   be given the old release's app.js or style.css under the new name, and would keep it for a year. This looks at what the page
   got: if any of its versioned files came from another release, it fetches them again past the browser's cache and reloads
   once. The data files are checked where they are fetched (relFetch in app.js, one.js and earth.js). Locally there is no release,
   so nothing is checked. This file itself is not versioned, so it is never kept long. */
(function () {
  "use strict";
  const rel = document.querySelector('meta[name="data-version"]')?.content;
  if (!rel || !window.fetch) return;
  const mine = [...document.querySelectorAll("script[src], link[rel=stylesheet][href]")].map((e) => e.src || e.href).filter((u) => u.includes("v=" + rel));
  if (!mine.length) return;
  const KEY = "atlas-release-fixed";
  let tried = null;
  try { tried = sessionStorage.getItem(KEY); } catch (e) {}
  if (tried === rel) return; // reloaded once already for this release: do not loop
  Promise.all(mine.map((u) => fetch(u, { cache: "force-cache" }).then((r) => r.headers.get("x-release") === rel, () => true)))
    .then((ok) => {
      if (ok.every(Boolean)) return;
      return Promise.all(mine.map((u) => fetch(u, { cache: "reload" }).catch(() => {}))).then(() => {
        try { sessionStorage.setItem(KEY, rel); } catch (e) {}
        location.reload();
      });
    });
})();
