const i = "amazon-affiliate-converter-v2", l = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/favicon.svg",
  "/icons/apple-touch-icon.png",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png"
];
self.addEventListener("install", (t) => {
  t.waitUntil(
    caches.open(i).then((e) => (console.log("Opened cache"), e.addAll(l))).then(() => self.skipWaiting())
    // Activate immediately
  );
});
self.addEventListener("activate", (t) => {
  t.waitUntil(
    caches.keys().then((e) => Promise.all(
      e.filter((s) => s !== i).map((s) => caches.delete(s))
    )).then(() => self.clients.claim())
    // Take control of all clients
  );
});
self.addEventListener("fetch", (t) => {
  t.request.url.includes("share-target") || t.respondWith(
    caches.match(t.request).then((e) => {
      if (e)
        return e;
      const s = t.request.clone();
      return fetch(s).then((a) => {
        if (!a || a.status !== 200 || t.request.method !== "GET")
          return a;
        const c = a.clone();
        return caches.open(i).then((r) => {
          r.put(t.request, c);
        }), a;
      });
    })
  );
});
self.addEventListener("fetch", (t) => {
  const e = new URL(t.request.url);
  if (e.searchParams.has("share-target") || e.pathname.includes("share-target") || e.searchParams.has("text") || e.searchParams.has("url")) {
    const s = e.searchParams.get("title") || "", a = e.searchParams.get("text") || "", c = e.searchParams.get("url") || "";
    t.respondWith((async () => {
      const r = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: !0
      });
      if (r.length > 0) {
        const n = r[0];
        return await n.focus(), n.postMessage({
          type: "SHARE_TARGET",
          title: s,
          text: a,
          url: c
        }), Response.redirect("/?share-success=true");
      } else {
        const n = await self.clients.openWindow("/?share-target=true");
        return n && setTimeout(() => {
          n.postMessage({
            type: "SHARE_TARGET",
            title: s,
            text: a,
            url: c
          });
        }, 1e3), Response.redirect("/?share-success=true");
      }
    })());
  }
});
