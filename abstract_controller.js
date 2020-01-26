let $ = document.querySelector.bind(document)

/**
 * This class is similar to html5 video/audio, but with some additions
 */
class AbstractController {

  /**
   * all parameters are optional
   * @param {string} mediaSelector selector to find audio/video element in DOM
   * @param {map} options {
   *   media: selector,
   *   playPrev: selector,
   *   playNext: selector,
   *   like: selector,
   *   dislike: selector
   * },
   * all selectors are optional
   */
  constructor(options = {}) {
    this.statusCache = null
    this.mediaSelector = 'video'
    for (let optionName in options) {
      let optionValue = options[optionName]
      switch (optionName) {
        case 'media':
          this.mediaSelector = optionValue
          break
        case 'currentTime':
          this.currentTimeSelector = optionValue
          break
        case 'duration':
          this.durationSelector = optionValue
          break
        case 'playPause':
          this.playPauseSelector = optionValue
          break
        case 'playPrev':
          this.playPrev = this.click.bind(this, optionValue)
          this.canPlayPrev = () => {
            let element = $(optionValue)
            return element && this.isVisible(element)
          }
          break
        case 'playNext':
          this.playNext = this.click.bind(this, optionValue)
          this.canPlayNext = () => {
            let element = $(optionValue)
            return element && this.isVisible(element)
          }
          break
        case 'like':
          this.like = this.click.bind(this, optionValue)
          this.canLike = () => {
            let element = $(optionValue)
            return element && this.isVisible(element)
          }
          break
        case 'dislike':
          this.dislike = this.click.bind(this, optionValue)
          this.canDislike = () => {
            let element = $(optionValue)
            return element && this.isVisible(element)
          }
          break
        case 'title':
          this.title = this.text.bind(this, optionValue)
          break
      }
    }
    if (this.getMedia())
      this.registerController()
    browser.runtime.onMessage.addListener(this.onMessage.bind(this))
  }

  play() {
    // prefer selector if specified
    if (this.playPauseSelector) {
      if (this.click(this.playPauseSelector))
        return
    }
    // default to media's play/pause
    let media = this.getMedia()
    if (media)
      media.play()
  }

  pause() {
    // prefer selector if specified
    if (this.playPauseSelector) {
      if (this.click(this.playPauseSelector))
        return
    }
    // default to media's play/pause
    let media = this.getMedia()
    if (media)
      media.pause()
  }

  get paused() {
    let media = this.getMedia()
    if (media)
      return media.paused
  }

  canSeek() {
    return true
  }

  get currentTime() {
    let media = this.getMedia()
    if (media)
      return media.currentTime
    return
  }

  set currentTime(currentTime) {
    let media = this.getMedia()
    if (media)
      media.currentTime = currentTime
  }

  get duration() {
    let media = this.getMedia()
    if (media)
      return media.duration
    return
  }

  canPlayPrev() {
    return false
  }

  playPrev() {}

  canPlayNext() {
    return false
  }

  playNext() {}

  get muted() {
    let media = this.getMedia()
    if (media)
      return media.muted
  }

  set muted(muted) {
    let media = this.getMedia()
    if (media)
      media.muted = muted
  }

  get volume() {
    let media = this.getMedia()
    if (media)
      return media.volume
  }

  set volume(volume) {
    let media = this.getMedia()
    if (media)
      media.volume = volume
  }

  get playbackRate() {
    let media = this.getMedia()
    if (media)
      return media.playbackRate
  }

  set playbackRate(playbackRate) {
    let media = this.getMedia()
    if (media)
      media.playbackRate = playbackRate
  }

  canLike() {
    return false
  }

  like() {}

  canDislike() {
    return false
  }

  dislike() {}

  // return string/title to display
  title() {}

  // return location/url to artwork image
  artwork() {}

  status() {
    let status = {}
    if (this.paused != null)
      status.paused = this.paused
    if (this.canSeek()
        && this.currentTime
        && typeof(this.currentTime) == 'number'
        && !isNaN(this.currentTime))
      status.currentTime = this.currentTime
    if (this.canSeek()
        && this.duration
        && typeof(this.duration) == 'number'
        && !isNaN(this.duration))
      status.duration = this.duration
    status.canPlayPrev = this.canPlayPrev()
    status.canPlayNext = this.canPlayNext()
    if (this.muted != null)
      status.muted = this.muted
    if (this.volume != null
        && typeof(this.volume) == 'number'
        && !isNaN(this.volume))
      status.volume = this.volume
    if (this.playbackRate != null)
      status.playbackRate = this.playbackRate
    status.canLike = this.canLike()
    status.canDislike = this.canDislike()
    if (this.title())
      status.title = this.title()
    if (this.artwork())
      status.artwork = this.artwork()
    return status
  }

  onMessage(message, sender, sendResponse) {
    let forceUpdate = false
    switch (message.action) {
      case 'play':
        this.play()
        break
      case 'pause':
        this.pause()
        break
      case 'stop':
        this.pause()
        this.currentTime = 0
        break
      case 'current-time':
        if (this.canSeek())
          this.currentTime = message.value
        break
      case 'play-prev':
        if (this.canPlayPrev())
          this.playPrev()
        break
      case 'play-next':
        if (this.canPlayNext())
          this.playNext()
        break
      case 'toggle-mute':
        this.muted = !this.muted
        break
      case 'volume':
        this.volume = message.value
        break
      case 'playback-rate':
        this.playbackRate = message.value
        break
      case 'like':
        if (this.canLike())
          this.like()
        break
      case 'dislike':
        if (this.canDislike())
          this.dislike()
        break
      case 'request-status':
        forceUpdate = true
        break
    }
    this.updateStatus(forceUpdate)
  }

  /**
   * returns media (audio/video element)
   */
  getMedia() {
    return $(this.mediaSelector)
  }

  /**
   * @returns true if video/audio can be controlled, false otherwise
   */
  isAvailable() {
    let media = this.getMedia()
    if (media) {
      // audio doesn't have to be visible
      if (media.tagName == "AUDIO")
        return true
      // true if video is visible
      // e.g. youtube hides the video elemen between menus
      if (this.isVisible(media))
        return true
    }
    // media element may be created on play lazily (e.g. spotify)
    if ($(this.playPauseSelector))
      return true
    return false
  }

  /**
   * @param {string} code javascript code to execute in browser
   */
  execute(code) {
    let script = document.createElement('script')
    script.textContent = code
    document.head.append(script)
    script.remove()
  }

  /**
   * @param {string} selector element that contains text to get
   * @returns text if found element, undefined otherwise
   */
  text(selector) {
    let element = $(selector)
    if (!element)
      return
    return element.innerText
  }

  /**
   * @param {string} selector element to click on
   * @returns true if found element, false otherwise
   */
  click(selector) {
    let element = $(selector)
    if (!element)
      return false
    element.click()
    return true
  }

  /**
   * expects scrollbar to be horizontal unused at the moment
   * @param {string} selector element/scrollbar to click on
   * @param {float} percentage 0 <= percentage <= 1.0, value to click on scrollbar
   * @returns true if element found, false otherwise
   */
  clickScrollbar(selector, percentage) {
    let seekbar = $(selector)
    if (!seekbar)
      return false
    let rect = seekbar.getBoundingClientRect()
    let event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: rect.x + percentage * rect.width
    })
    seekbar.dispatchEvent(event)
    return true
  }

  /**
   * @param {string} text in format hh:mm:ss
   * @returns time in seconds or undefined
   */
  textToTime(text) {
    if (!text)
      return
    let numbers = text.split(':').reverse().map((text) => parseInt(text))
    const factors = [1, 60, 3600]
    let time = 0
    for (let i = 0; i < numbers.length; i++) {
      if (i < factors.length)
        time += numbers[i] * factors[i]
    }
    return time
  }

  /**
   * @returns true if element is visible somewhere on the webpage,
   *          false otherwise
   */
  isVisible(element) {
    return !!(element && element.offsetParent)
  }

  /**
   * register controller in background.js
   */
  registerController() {
    if (this.isRegistered)
      return
    this.isRegistered = true
    browser.runtime.sendMessage({
      action: 'register',
      status: this.status()
    })
  }

  /**
   * unregister controller in background.js
   */
  unregisterController() {
    if (!this.isRegistered)
      return
    this.isRegistered = false
    browser.runtime.sendMessage({
      action: 'unregister'
    })
  }

  /**
   * send status to background if a attribute changed
   * @param {bool} forceUpdate if true, this will always send the message even without changes
   */
  updateStatus(forceUpdate) {
    if (!this.isRegistered)
      return
    let status = this.status()
    if (JSON.stringify(status) == JSON.stringify(this.statusCache) && !forceUpdate)
      return
    this.statusCache = status
    browser.runtime.sendMessage({
      action: 'update-status',
      status: status
    })
  }
}

// register/unregister controller automatically in dom using mutation observer
// media may not exist in registerCallback
function mutationObserverAutoRegister(
    controller,
    registerCallback = () => {},
    unregisterCallback = () => {}) {
  if (controller.isRegistered)
    registerCallback()
  let observer = new MutationObserver(() => {
    if (controller.isAvailable()) {
      if (!controller.isRegistered) {
        console.log('controller registered')
        controller.registerController()
        registerCallback()
      }
    } else {
      if (controller.isRegistered) {
        console.log('controller unregistered')
        controller.unregisterController()
        unregisterCallback()
      }
    }
  })
  observer.observe(document.documentElement, {
    attributes: true,
    childList: true,
    subtree: true
  })
  window.addEventListener('beforeunload', controller.unregisterController.bind(controller))
  return observer
}

// register/unregister controller automatically in regular time intervals
// most abstract solution, unused atm
function intervalAutoRegister(
    controller,
    registerCallback = () => {},
    unregisterCallback = () => {},
    interval = 1000) {
  if (controller.isRegistered)
    registerCallback()
  setInterval(() => {
    if (controller.getMedia()) {
      if (!controller.isRegistered) {
        controller.unregisterController
        registerCallback()
      }
    } else {
      if (controller.isRegistered) {
        controller.unregisterController()
        unregisterCallback()
      }
    }
  }, interval)
}

// find when media object changes of a controller
function onMediaChanged(controller, callback) {
  let prevMedia = null
  let observer = new MutationObserver(() => {
    let media = controller.getMedia()
    if (media != prevMedia) {
      prevMedia = media
      callback(controller, media)
    }
  })
  observer.observe(document.documentElement, {
    attributes: true,
    childList: true,
    subtree: true
  })
  window.addEventListener(
    'beforeunload', callback.bind(controller, controller, null))
  return observer
}

// listen for media attribute changes and publish status to mpris/popup
function autoUpdateStatus(controller) {
  let media = controller.getMedia()
  if (!media)
    return
  let updateFunction = controller.updateStatus.bind(controller)
  let events = ['seeked', 'ended',
    'ratechange', 'volumechange',
    'play', 'pause',
    'durationchange', 'timeupdate'
  ]
  for (let event of events) {
    media.addEventListener(event, updateFunction)
  }
  let observer = new MutationObserver(updateFunction)
  observer.observe(media, {
    attributes: true
  })
  return observer
}
