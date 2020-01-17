class SpotifyCloudController extends AbstractController {
  constructor() {
    super({
      playPrev: '.Root__now-playing-bar > footer:nth-child(1) >' +
                'div:nth-child(1) > div:nth-child(2) >' +
                'div:nth-child(1) > div:nth-child(1) >' +
                'div:nth-child(2) > button:nth-child(1)',
      playNext: '.Root__now-playing-bar > footer:nth-child(1) >' +
                'div:nth-child(1) > div:nth-child(2) >' +
                'div:nth-child(1) > div:nth-child(1) >' +
                'div:nth-child(4) > button:nth-child(1)',
      media: '#skMedias > audio:nth-child(1)',
      title: ['.TrackListHeader__entity-name > h2:nth-child(1) >' +
              'span:nth-child(1)']
    })
  }
}

window.mediaObserver = null

function registeredCallback() {
  window.controller.play()
}

function mediaChanged(_controller, media) {
  if (window.mediaObserver != null)
    window.mediaObserver.disconnect()
  if (media != null)
    window.mediaObserver = autoUpdateStatus(window.controller)
}

window.controller = new SpotifyCloudController()
mutationObserverAutoRegister(
  window.controller,
  registeredCallback)
onMediaChanged(window.controller, mediaChanged)
