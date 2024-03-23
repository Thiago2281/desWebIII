self.addEventListener('fetch', function (event) {
    console.log('service working')
    let req = new Request(event.request, {
        headers: { "foo": "bar" }
    });
    event.respondWith(fetch(req));
});
// self.addEventListener('install', function(event) {
//     event.waitUntil(
//       caches.open('cache-v1').then(function(cache) {
//         return cache.addAll([
//           '/',
//           '/index.html',
//           '/_img/avatar.jpg',
//           '/_img/editar.jpg',
//           '/_img/laptop.jpg',
//           '/_img/livro logo.png',
//           '/_img/livro-aberto-capa.png',
//           '/_img/menu.png',
//           '/_img/pencil-square.svg',
//           '/_img/x-circle.svg',
//         ]);     
//       })   
//     ); 
//   });
  