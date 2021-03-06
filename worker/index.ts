//Service worker for notifications?
// https://github.com/shadowwalker/next-pwa/tree/master/examples/custom-ts-worker
//https://github.com/shadowwalker/next-pwa/blob/master/examples/custom-ts-worker/worker/index.ts
export default {};

// listen to message event from window
self.addEventListener('message', event => {
    // HOW TO TEST THIS?
    // Run this in your browser console:
    //     window.navigator.serviceWorker.controller.postMessage({command: 'log', message: 'hello world'})
    // OR use next-pwa injected workbox object
    //     window.workbox.messageSW({command: 'log', message: 'hello world'})
    console.log(event?.data);
  });
  

// self.addEventListener('message', async (event?: ExtendableMessageEvent) => {
//     // console.log(event)
//     if (event && event.data && event.data.action === 'CACHE_NEW_ROUTE') {
//     caches.open('v1').then(cache =>
        
//         cache.match(event.source.url).then(res => {
//         if (res === undefined) {
//             return cache.add(event.source.url)
//         }
//         })
//     )
//     }
// })
  
declare let self: ServiceWorkerGlobalScope