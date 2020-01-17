class SoundCloudController extends AbstractController {
  constructor() {
    super({
      playPrev: 'button.skipControl:nth-child(1)',
      playNext: 'button.skipControl:nth-child(3)',
      media: '#skMedias > audio:nth-child(2)',
      title: ['.playbackSoundBadge__titleLink > span:nth-child(2)']
    })
  }

  get currentTime() {
    return super.currentTime
  }

  set currentTime(currentTime) {
    let media = this.getMedia()
    if (!media)
      return
    super.execute(`window.skAudioPlayer.sound.seek(1000 * ${currentTime});`)
  }

  get duration() {
    let element = document.querySelector(
        '.playbackTimeline__duration > span:nth-child(2)')
    if (element == null)
      return null
    return super.textToTime(element.innerText)
  }
}

window.mediaObserver = null

function registeredCallback() {
  window.mediaObserver = autoUpdateStatus(window.controller)
}

function unregisteredCallback() {
  window.mediaObserver.disconnect()
}

window.controller = new SoundCloudController()
mutationObserverAutoRegister(
    window.controller,
    registeredCallback,
    unregisteredCallback)
