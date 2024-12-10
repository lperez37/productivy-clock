export function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => {
        console.log('ServiceWorker registration successful')
      })
      .catch((error) => {
        console.error('ServiceWorker registration failed:', error)
      })
  }
} 