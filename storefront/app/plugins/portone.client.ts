export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    const script = document.createElement('script')
    script.src = 'https://cdn.iamport.kr/v1/iamport.js'
    script.async = true
    document.head.appendChild(script)
  }
})
