class YoutubeController extends AbstractController {
  constructor() {
    super({
      playPrev: '.ytp-prev-button',
      playNext: '.ytp-next-button',
      like: '#menu > ytd-menu-renderer > #top-level-buttons > ytd-toggle-button-renderer:nth-child(1)',
      dislike: '#menu > ytd-menu-renderer > #top-level-buttons > ytd-toggle-button-renderer:nth-child(2)',
      title: 'yt-formatted-string.ytd-video-primary-info-renderer:nth-child(1)'
    })
  }
}

function registeredCallback() {
  window.mediaObserver = autoUpdateStatus(window.controller)
}

function unregisteredCallback() {
  window.mediaObserver.disconnect()
}

window.mediaObserver = null
window.controller = new YoutubeController()
mutationObserverAutoRegister(
    window.controller, registeredCallback, unregisteredCallback)
