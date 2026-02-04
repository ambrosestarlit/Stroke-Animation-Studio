const CACHE='stroke-studio-v1';

self.addEventListener('install',e=>{
  self.skipWaiting();
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>
      Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
    ).then(()=>clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  e.respondWith(
    caches.match(e.request).then(r=>{
      if(r)return r;
      return fetch(e.request).then(res=>{
        if(res.ok&&e.request.method==='GET'){
          const c=res.clone();
          caches.open(CACHE).then(cache=>cache.put(e.request,c));
        }
        return res;
      }).catch(()=>caches.match(e.request));
    })
  );
});
