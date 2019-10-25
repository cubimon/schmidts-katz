// called if user closes tab
browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
  delete controllers[tabId]
  removeControllerTabId(tabId)
})

// called if user switches tab
browser.tabs.onActivated.addListener((activeInfo) => {
  if (activeInfo.tabId in controllerStack)
    updateControllerTabId(activeInfo.tabId)
})

class BackgroundController {

  constructor(tabId, status) {
    this.tabId = tabId
    this.setStatus(status)
  }

  play() {
    browser.tabs.sendMessage(this.tabId, {
      action: 'play'
    })
  }

  pause() {
    browser.tabs.sendMessage(this.tabId, {
      action: 'pause'
    })
  }

  stop() {
    browser.tabs.sendMessage(this.tabId, {
      action: 'stop'
    })
  }

  setCurrentTime(currentTime) {
    currentTime = Math.max(0, Math.min(this.duration, currentTime))
    browser.tabs.sendMessage(this.tabId, {
      action: 'current-time',
      value: currentTime
    })
  }

  playPrev() {
    browser.tabs.sendMessage(this.tabId, {
      action: 'play-prev'
    })
  }

  playNext() {
    browser.tabs.sendMessage(this.tabId, {
      action: 'play-next'
    })
  }

  toggleMute() {
    browser.tabs.sendMessage(this.tabId, {
      action: 'toggle-mute'
    })
  }

  setVolume(volume) {
    volume = Math.max(0.0, Math.min(1.0, volume))
    browser.tabs.sendMessage(this.tabId, {
      action: 'volume',
      value: volume
    })
  }

  setPlaybackRate(playbackRate) {
    browser.tabs.sendMessage(this.tabId, {
      action: 'playback-rate',
      value: playbackRate
    })
  }

  like() {
    browser.tabs.sendMessage(this.tabId, {
      action: 'like'
    })
  }

  dislike() {
    browser.tabs.sendMessage(this.tabId, {
      action: 'dislike'
    })
  }

  setStatus(status) {
    for (let attrName in status)
      this[attrName] = status[attrName]
  }
}

// commands listener
browser.commands.onCommand.addListener((command) => {
  let controller = getActiveController()
  if (!controller)
    return
  switch (command) {
    case 'play-pause':
      if (controller.paused)
        controller.play()
      else
        controller.pause()
      break
    case 'stop':
      controller.stop()
      break
    case 'backward':
      controller.setCurrentTime(controller.currentTime - 10.0)
      break
    case 'forward':
      controller.setCurrentTime(controller.currentTime + 10.0)
      break
    case 'play-prev':
      controller.playPrev()
      break
    case 'play-next':
      controller.playNext()
      break
    case 'toggle-mute':
      controller.toggleMute()
      break
    case 'volume-down':
      controller.setVolume(controller.volume - 0.05)
      break
    case 'volume-up':
      controller.setVolume(controller.volume + 0.05)
      break
    case 'playback-rate-decrease':
      controller.setPlaybackRate(controller.playbackRate - 0.05)
      break
    case 'playback-rate-increase':
      controller.setPlaybackRate(controller.playbackRate + 0.05)
      break
    case 'like':
      controller.like()
      break
    case 'dislike':
      controller.dislike()
      break
  }
})

// tab id -> controller
let controllers = {}
// tab ids in order they were created
let controllerStack = []
// true if popup is opened, false otherwise
let isPopupOpen = false

// null if no controller
function getActiveTabId() {
  if (controllerStack.length == 0)
    return null
  return controllerStack[controllerStack.length - 1]
}

// null if no controller
function getActiveController() {
  return getController(getActiveTabId())
}

// get tab controller by tab id
function getController(tabId) {
  if (tabId == null)
    return null
  if (!(tabId in controllers))
    return null
  return controllers[tabId]
}

// move tab id on top of controller stack
function updateControllerTabId(tabId) {
  removeControllerTabId(tabId)
  controllerStack.push(tabId)
}

// remove tab id from controller stack
function removeControllerTabId(tabId) {
  let index = controllerStack.indexOf(tabId)
  if (index >= 0)
    controllerStack.splice(index, 1)
}

// TODO: add function handleMessage that works with commands and messages
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(`background message: ${JSON.stringify(message)}`)
  switch (message.action) {
    case 'register':
      controllers[sender.tab.id] =
          new BackgroundController(sender.tab.id, message.status)
      updateControllerTabId(sender.tab.id)
      return
    case 'unregister':
      delete controllers[sender.tab.id]
      removeControllerTabId(sender.tab.id)
      return
    case 'update-status':
      // call from website
      if (controllers[sender.tab.id])
        controllers[sender.tab.id].setStatus(message.status)
      return
    case 'popup opened':
      isPopupOpen = true
      if (getActiveTabId() != null) {
        browser.tabs.sendMessage(getActiveTabId(), {
          action: 'request-status'
        })
      }
      return
    case 'popup closed':
      isPopupOpen = false
      return
  }
  let controller = getActiveController()
  if (!controller)
    return
  switch (message.action) {
    case 'play-pause':
      if (controller.paused)
        controller.play()
      else
        controller.pause()
      break
    case 'current-time':
      controller.setCurrentTime(message.currentTime)
      break
    case 'backward':
      controller.setCurrentTime(controller.currentTime - 10.0)
      break
    case 'forward':
      controller.setCurrentTime(controller.currentTime + 10.0)
      break
    case 'play-prev':
      controller.playPrev()
      break
    case 'play-next':
      controller.playNext()
      break
    case 'toggle-mute':
      controller.toggleMute()
      break
    case 'volume':
      controller.setVolume(message.volume)
      break
    case 'like':
      controller.like()
      break
    case 'dislike':
      controller.dislike()
      break
  }
})
