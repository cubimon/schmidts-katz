class YoutubeController extends AbstractController {
  constructor() {
    super('video', {
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
  window.mediaObserver = autoUpdateStatusController(window.controller)
}

function unregisteredCallback() {
  window.mediaObserver.disconnect()
}

window.controller = new YoutubeController()
autoRegisterController(window.controller, registeredCallback, unregisteredCallback)

console.log('youtube controller')
