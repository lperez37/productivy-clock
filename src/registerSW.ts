export function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .catch((error) => {
        console.error('ServiceWorker registration failed:', error)
      })
  }
} 