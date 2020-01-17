// proxy document.createElement to intercept audio/video elements
if (window.skOldCreateElement == undefined) {
  console.log("adding media interceptor")
  window.skOldCreateElement = document.createElement
  window.skMedias = []
  document.createElement = function(...args) {
    let element = window.skOldCreateElement.apply(document, args)
    if(args.length > 0 && (args[0] == "video" || args[0] == "audio")) {
      console.log(`found ${args[0]} element`)
      document.querySelector("#skMedias").append(element)
      window.skMedias.push(element)
    }
    return element
  }
}
