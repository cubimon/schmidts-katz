// TODO: use web_accessible_resources
function getLoadAndPatchCode(urlpattern, searchvalue, newvalue) {
  // scope = function
  return `(() => {
    window.addEventListener('beforescriptexecute', function(e) {
      let url = e.target.src
      let pattern = ${urlpattern}
      if (!pattern.test(url))
        return
      console.log(\`url \$\{url\} matches pattern\`)
      e.preventDefault()
      let newNode = document.createElement('script')
      newNode.textContent = \`(() => {
        let xhttp = new XMLHttpRequest()
        // this must be a function, otherwise >this< doesn't work
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            let js = xhttp.responseText
            let oldJs = js
            js = js.replace('${searchvalue}',
                            '${newvalue}')
            js = 'console.log("executing patched code");' + js + '\\\\r\\\\n//# sourceURL=patched.js'
            console.log('patching \$\{url\}')
            let script = document.createElement('script')
            script.textContent = js
            // append to end/after current script
            if (document.currentScript.parentElement.lastElementChild == document.currentScript)
              document.currentScript.parentElement.append(script)
            else
              document.currentScript.parentElement.insertBefore(script, document.currentScript.nextElementSibling)
            console.log('patching finished')
          }
        }
        // synchronous
        xhttp.open('GET', '\$\{url\}', false)
        xhttp.send()
      })()
      //# sourceURL=patch.js\`
      document.head.append(newNode)
    })
  })()
  //# sourceURL=patcher.js`
}

// modifies all javascript file that matches urlpattern
// in each js file searchvalue is replaced by newvalue
// this doesn't:
// - modify the url/domain of the original js code
// - add any evil code that tracks user actions or
//   send private data to a malicious server.
//   To verify this, find references of this function,
//   e.g. `git grep -i patch\\(` in the project root directory
function patch(urlpattern, searchvalue, newvalue) {
  let script = document.createElement('script')
  script.textContent = getLoadAndPatchCode(urlpattern, searchvalue, newvalue)
  document.documentElement.append(script)
}
