let code = `
if (window.skOldCreateElement == undefined) {
  console.log("adding media interceptor")
  window.skOldCreateElement = document.createElement
  window.skMedias = []
  document.createElement = function(...args) {
    let element = window.skOldCreateElement.apply(document, args)
    if(args.length > 0 && (args[0] == "video" || args[0] == "audio")) {
      document.querySelector("#skMedias").append(element)
      window.skMedias.push(element)
    }
    return element
  }
}`
let initialized = false
let callback = () => {
  if (document.head && !initialized) {
    let mediaContainer = document.createElement("div")
    mediaContainer.id = "skMedias"
    document.documentElement.appendChild(mediaContainer)
    let script = document.createElement("script")
    script.textContent = code
    document.head.appendChild(script)
    script.remove()
    initialized = true
  }
}
let observer = new MutationObserver(callback)
observer.observe(document, {
  childList: true,
  subtree: true
})
