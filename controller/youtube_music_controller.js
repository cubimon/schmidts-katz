class YoutubeMusicController extends AbstractController {
  constructor() {
    super({
      playPrev: '.previous-button > iron-icon:nth-child(1)',
      playNext: '.next-button > iron-icon:nth-child(1)',
      like: '.dislike > iron-icon:nth-child(1)',
      dislike: '.like > iron-icon:nth-child(1)',
      title: '.content-info-wrapper > yt-formatted-string:nth-child(1) >' +
             'span:nth-child(1)'
    })
  }
}

window.mediaObserver = null

function registeredCallback() {
  window.mediaObserver = autoUpdateStatus(window.controller)
}

function unregisteredCallback() {
  window.mediaObserver.disconnect()
}

window.controller = new YoutubeMusicController()
mutationObserverAutoRegister(window.controller, registeredCallback, unregisteredCallback)
