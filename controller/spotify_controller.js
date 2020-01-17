class SpotifyCloudController extends AbstractController {
  constructor() {
    super({
      media: '#skMedias > audio:nth-child(1)',
      title: ['.TrackListHeader__entity-name > h2:nth-child(1) > span:nth-child(1)']
    })
    this.playPauseSelector = [
      '.Root__now-playing-bar > footer:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > button:nth-child(1)'
    ]
  }

  play() {
    super.click(this.playPauseSelector)
  }

  pause() {
    super.click(this.playPauseSelector)
  }
}

window.mediaObserver = null

function registeredCallback() {
  console.log('register callback')
  window.controller.play()
  //window.controller.pause()
}

function mediaChanged(controller, media) {
  console.log('media changed')
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
