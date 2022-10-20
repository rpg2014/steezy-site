import { useRouter } from "next/router"
import { useEffect, useState } from "react"


declare global {
    interface Window {
        workbox:any;
    }
}

export const  useSetupServiceWorker  = () => {
    const logEvent = (event: {type: string}) =>{
        console.log(`[ServiceWorker] ${event.type} event triggered.`)
        console.log(event)
    }
    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.workbox !== undefined) {
          const wb = window.workbox
          // add event listeners to handle any of PWA lifecycle event
          // https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-window.Workbox#events
          wb.addEventListener('installed', (event: { type: any }) => {
            logEvent(event);
          })
    
          wb.addEventListener('controlling', (event: { type: any }) => {
            logEvent(event);
          })
    
          wb.addEventListener('activated', (event: { type: any }) => {
            logEvent(event);
          })
    
          // A common UX pattern for progressive web apps is to show a banner when a service worker has updated and waiting to install.
          // NOTE: MUST set skipWaiting to false in next.config.js pwa object
          // https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
          const promptNewVersionAvailable = (event: any) => {
            // `event.wasWaitingBeforeRegister` will be false if this is the first time the updated service worker is waiting.
            // When `event.wasWaitingBeforeRegister` is true, a previously updated service worker is still waiting.
            // You may want to customize the UI prompt accordingly.
            if (confirm('A newer version of this web app is available, reload to update?')) {
              wb.addEventListener('controlling', (event: any) => {
                window.location.reload()
              })
    
              // Send a message to the waiting service worker, instructing it to activate.
              wb.messageSkipWaiting()
            } else {
              console.log(
                '[Service Worker] User rejected to reload the web app, keep using old version. New version will be automatically load when user open the app next time.'
              )
            }
          }
    
          wb.addEventListener('waiting', promptNewVersionAvailable)
    
          // ISSUE - this is not working as expected, why?
          // I could only make message event listenser work when I manually add this listenser into sw.js file
          wb.addEventListener('message', (event: { type: any }) => {
            console.log(`Event ${event.type} is triggered.`)
            console.log(event)
          })
    
          /*
          wb.addEventListener('redundant', event => {
            console.log(`Event ${event.type} is triggered.`)
            console.log(event)
          })
          wb.addEventListener('externalinstalled', event => {
            console.log(`Event ${event.type} is triggered.`)
            console.log(event)
          })
          wb.addEventListener('externalactivated', event => {
            console.log(`Event ${event.type} is triggered.`)
            console.log(event)
          })
          */
    
          // never forget to call register as auto register is turned off in next.config.js
          wb.register()
        }
      }, [])


      //// the below uses workbox to send a message to the serviceworker and also manages the state of the online / offline events
      // try to prevent links from breaking by precaching see: https://github.com/shadowwalker/next-pwa/tree/master/examples/cache-on-front-end-nav
    //   const [isOnline, setIsOnline] = useState(true)
    //   useEffect(() => {
    //     if (typeof window !== 'undefined' && 'ononline' in window && 'onoffline' in window) {
    //       setIsOnline(window.navigator.onLine)
    //       if (!window.ononline) {
    //         window.addEventListener('online', () => {
    //           setIsOnline(true)
    //         })
    //       }
    //       if (!window.onoffline) {
    //         window.addEventListener('offline', () => {
    //           setIsOnline(false)
    //         })
    //       }
    //     }
    //   }, [])
    
      
    //   const router = useRouter()
    //   useEffect(() => {
    //     if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.workbox !== undefined && isOnline) {
    //       // skip index route, because it's already cached under `start-url` caching object
    //       if (router.route !== '/') {
    //         const wb = window.workbox
    //         wb.active.then((_worker: any) => {
    //           wb.messageSW({ action: 'CACHE_NEW_ROUTE' })
    //         })
    //       }
    //     }
    //   }, [isOnline, router.route])
}