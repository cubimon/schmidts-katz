function getLoadAndPatchCode(element, urlpattern, searchvalue, newvalue) {
  // scope = function
  return `(() => {
    let callback = (mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type == 'childList') {
          if (mutation.addedNodes.length == 0)
            continue
          let node = mutation.addedNodes[0]
          if (node.nodeName != 'SCRIPT')
            continue
          let pattern = ${urlpattern}
          if (!pattern.test(node.src))
            continue
          let url = node.src
          node.removeAttribute('src')
          node.textContent = ''
          let newNode = document.createElement('script')
          newNode.textContent = \`
            let xhttp = new XMLHttpRequest()
            // this must be a function, otherwise >this< doesn't work
            xhttp.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                let js = xhttp.responseText
                js = js.replace('${searchvalue}',
                                '${newvalue}')
                console.log('patching \$\{url\}')
                let script = document.createElement('script')
                script.textContent = js
                // append to end/after current script
                if (document.currentScript.parentElement.lastElementChild == document.currentScript)
                  document.currentScript.parentElement.appendChild(script)
                else
                  document.currentScript.parentElement.insertBefore(script, document.currentScript.nextElementSibling)
              }
            }
            // synchronous
            xhttp.open('GET', '\$\{url\}', false)
            xhttp.send()
            //# sourceURL=patch.js\`
          document.head.append(newNode)
        }
      }
    }
    let observer = new MutationObserver(callback)
    observer.observe(${element}, {
      childList: true,
      subtree: true
    })
  })()`
}

// modifies all javascript file that matches urlpattern
// in each js file searchvalue is replaced by newvalue
// this doesn't:
// - modify the url/domain of the original js code
// - add any evil code that tracks user actions or send private data to a malicious server,
//   to verify this, find references of this functions, e.g. `git grep -i patch(`
//   in the project root directory
function patch(urlpattern, searchvalue, newvalue) {
  // listen for head changes
  let initialized = false
  let callback = () => {
    if (document.head && !initialized) {
      let script = document.createElement('script')
      script.textContent = getLoadAndPatchCode('document.head', urlpattern, searchvalue, newvalue)
      document.head.append(script)
      initialized = true
    }
  }
  let observer = new MutationObserver(callback)
  observer.observe(document, {
    childList: true,
    subtree: true
  })
  // listen for body changes
  let script = document.createElement('script')
  script.textContent = getLoadAndPatchCode('document.body', urlpattern, searchvalue, newvalue)
  document.documentElement.append(script)
}
