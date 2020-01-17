class SoundCloudController extends AbstractController {
  constructor() {
    super({
      media: '#skMedias > audio:nth-child(2)',
      title: ['span.soundTitle__title > span:nth-child(1)']
    })
    this.playPauseSelector = [
      '.playControl'
    ]
  }

  play() {
    let media = this.getMedia()
    if (media && media.paused)
      super.click(this.playPauseSelector)
  }

  pause() {
    let media = this.getMedia()
    if (media && !media.paused)
      super.click(this.playPauseSelector)
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
