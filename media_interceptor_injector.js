let initialized = false
let callback = () => {
  if (document.head && !initialized) {
    let mediaContainer = document.createElement('div')
    mediaContainer.id = 'skMedias'
    document.documentElement.appendChild(mediaContainer)
    let script = document.createElement('script')
    script.src = browser.runtime.getURL('media_interceptor.js')
    // script.onload = () => {
    //   this.remove()
    // }
    document.head.appendChild(script)
    initialized = true
  }
}
let observer = new MutationObserver(callback)
observer.observe(document, {
  childList: true,
  subtree: true
})