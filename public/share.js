/* The share dialog, for both sides of the atlas: the page's picture, its link, and the sites people share to.
   atlasShare({ path, title, text, pic, find }, opener): path and pic as on the site ("realms/kanva-dynasty/", "realms/kanva-dynasty": the
   picture /og/<pic>.jpg, which tools/og.mjs draws); find, if given, looks path and pic up when the dialog opens.
   X, Facebook and WhatsApp take a link. Instagram takes none from a web page, only a picture: a phone's own share sheet is given the
   file; elsewhere it is saved and the link copied. Nothing is loaded from those sites. Used by one/one.js and app.js; styles in share.css. */
(function () {
"use strict";
const SITE = /(^|\.)worldatlas\.site$/.test(location.hostname) ? "https://www.worldatlas.site" : location.origin;
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const ic = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const BRAND = {
  x: '<path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.5L6.3 22H3.2l7.3-8.3L2.8 2h6.4l4.5 5.9zM17.8 20.1h1.7L8.3 3.8H6.5z"/>',
  facebook: '<path d="M14 8.5V6.9c0-.8.5-1 .9-1H17V2.1L14.1 2C10.9 2 10 4.4 10 6.3v2.2H7.5v4H10V22h4v-9.5h2.9l.5-4z"/>',
};
window.atlasShare = async function (sp, opener) {
  document.getElementById("share")?.remove();
  const D = document.createElement("dialog"), phone = matchMedia("(pointer: coarse)").matches;
  const brand = (k) => `<svg viewBox="0 0 24 24" class="shmark" aria-hidden="true">${BRAND[k]}</svg>`;
  D.id = "share"; D.setAttribute("aria-label", `Share ${sp.title}`);
  D.innerHTML = `<div class="shbody"><div class="shhead"><h2>Share</h2><button type="button" class="shx" aria-label="Close">${ic('<path d="M6 6l12 12M18 6 6 18"/>')}</button></div>
    <figure><img alt="" width="1200" height="630"></figure><p class="shtitle">${esc(sp.title)}</p>
    <div class="shlink"><input readonly aria-label="Link to this page"><button type="button" class="shbtn dark" data-sh="copy">Copy link</button></div>
    <div class="shto">
      <a target="_blank" rel="noopener" data-sh="x">${brand("x")}X</a>
      <a target="_blank" rel="noopener" data-sh="facebook">${brand("facebook")}Facebook</a>
      <button type="button" data-sh="instagram">${ic('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><path d="M17.2 6.8h.01"/>')}Instagram</button>
      <a target="_blank" rel="noopener" data-sh="whatsapp">${ic('<path d="M3 21l1.4-4.6A8.6 8.6 0 1 1 7.7 19.6z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l.8-1.7-2-1-1 .9a5 5 0 0 1-2.5-2.5l.9-1-1-2z"/>')}WhatsApp</a>
    </div><div class="shmore"><button type="button" class="shbtn" data-sh="save">${ic('<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 20h14"/>')}Save picture</button>
      ${navigator.share ? `<button type="button" class="shbtn" data-sh="more">${ic('<path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>')}More</button>` : ""}
    </div><p class="shnote" role="status"></p></div>`;
  document.body.append(D); D.showModal();
  const q = (s) => D.querySelector(s), note = (t) => { q(".shnote").textContent = t; };
  let file = null, pic = null;
  D.addEventListener("close", () => { if (pic) URL.revokeObjectURL(pic); D.remove(); if (opener?.isConnected) opener.focus(); });
  D.addEventListener("keydown", (ev) => ev.stopPropagation()); // the arrows and the space bar move the atlas's time
  if (sp.find) sp = { ...sp, ...(await sp.find()) }; // the address is looked up now
  const url = `${SITE}/${sp.path}`, text = sp.text || `${sp.title}, on The World Atlas`, e = encodeURIComponent;
  q("input").value = url;
  q('[data-sh="x"]').href = `https://x.com/intent/post?text=${e(text)}&url=${e(url)}`;
  q('[data-sh="facebook"]').href = `https://www.facebook.com/sharer/sharer.php?u=${e(url)}`;
  q('[data-sh="whatsapp"]').href = `https://wa.me/?text=${e(`${text} ${url}`)}`;
  // The picture is fetched now, not on the tap: a phone opens its share sheet only straight after one.
  const load = async (src) => { const r = await fetch(src); if (!r.ok || !/^image/.test(r.headers.get("content-type") || "")) throw new Error("no picture"); return r.blob(); };
  (sp.pic ? load(`/og/${sp.pic}.jpg`).catch(() => load("/og.png")) : load("/og.png")).then((b) => {
    if (!D.isConnected) return;
    file = new File([b], `${(sp.pic || "the-world-atlas").split("/").pop()}.${b.type === "image/png" ? "png" : "jpg"}`, { type: b.type });
    pic = URL.createObjectURL(b); q("figure img").src = pic; q("figure img").alt = `The picture shown with the link: ${sp.title}`;
  }, () => { q("figure").hidden = true; });
  const copy = async () => { try { await navigator.clipboard.writeText(url); return true; } catch (err) { q("input").select(); return document.execCommand("copy"); } };
  const save = () => { const a = document.createElement("a"); a.href = pic; a.download = file.name; D.append(a); a.click(); a.remove(); };
  D.addEventListener("click", async (ev) => {
    if (ev.target === D || ev.target.closest(".shx")) return D.close();
    const k = ev.target.closest("[data-sh]")?.dataset.sh;
    if (k === "copy") return note((await copy()) ? "Link copied." : "Select the link above and copy it.");
    if (k === "more") return navigator.share({ title: sp.title, text, url }).catch(() => {});
    if (k !== "save" && k !== "instagram") return;
    if (!file) return note("The picture is still loading. Try again in a moment.");
    if (k === "save") { save(); return note("Picture saved."); }
    if (phone && navigator.canShare?.({ files: [file] })) {
      navigator.clipboard?.writeText(url).catch(() => {});
      return navigator.share({ files: [file] }).then(() => note("Paste the link in a story's link sticker or your bio."), () => {});
    }
    const ok = await copy(); save();
    note(`Picture saved${ok ? " and link copied" : ""}. Post the picture on Instagram, then paste the link in a story's link sticker or your bio.`);
  });
};
})();
