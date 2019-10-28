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

window.mediaObserver = null

function registeredCallback() {
  console.log('registered callback')
  window.mediaObserver = autoUpdateStatusController(window.controller)
}

function unregisteredCallback() {
  console.log('unregistered callback')
  window.mediaObserver.disconnect()
}

window.controller = new YoutubeController()
autoRegisterController(window.controller, registeredCallback, unregisteredCallback)

console.log('youtube controller')
