#!/usr/bin/node
let Player = require('mpris-service')

let player = null
let playerCurrentTime = 0
let status = null

function sendMessage(action, parameters = []) {
  let message = {}
  for (let attrName in parameters)
    message[attrName] = parameters[attrName]
  message.action = action
  message = JSON.stringify(message)
  let sizeBuffer = Buffer.alloc(4)
  sizeBuffer.writeInt32LE(message.length)
  process.stdout.write(sizeBuffer)
  process.stdout.write(message)
}

function play() {
  sendMessage('play')
}

function pause() {
  sendMessage('pause')
}

function playPause() {
  if (status != null && controller.paused)
    sendMessage('play')
  else
    sendMessage('pause')
}

function stop() {
  sendMessage('stop')
}

function seeked(offset) {
  playerCurrentTime += offset
  sendMessage('current-time', {
    currentTime: playerCurrentTime / (1000 * 1000)
  })
}

function playPrev() {
  sendMessage('play-prev')
}

function playNext() {
  sendMessage('play-next')
}

function setVolume(volume) {
  player.volume = Math.max(0.0, Math.min(1.0, volume))
  sendMessage('volume', {
    volume: volume
  })
}

function setPlaybackRate(playbackRate) {
  player.rate = playbackRate
  sendMessage('playback-rate', {
    playbackRate: playbackRate
  })
}

function registerPlayer() {
  unregisterPlayer()
  player = new Player({
    name: 'Schmidts_Katz',
    identity: 'Schmidt\'s Katz'
  })
  player.getPosition = () => playerCurrentTime
  player.on('play', play)
  player.on('pause', pause)
  player.on('playpause', playPause)
  player.on('stop', stop)
  player.on('seek', seeked)
  player.on('previous', playPrev)
  player.on('next', playNext)
  player.on('volume', setVolume)
  player.on('rate', setPlaybackRate)
}

function unregisterPlayer() {
  if (player == null)
    return
  player._bus.disconnect()
  player = null
}

let buffer = Buffer.alloc(0)
process.stdin.on('data', (chunk) => {
  buffer =  Buffer.concat([buffer, chunk])
  if (buffer.length < 4)
    return
  let size = buffer.readInt32LE()
  // not enough data
  if (buffer.length - 4 < size)
    return
  let message = chunk.toString('utf-8', 4)
  buffer = buffer.slice(size + 4)
  try {
    message = JSON.parse(message)
  } catch (err) {
    return
  }
  if (!'action' in message)
    return
  switch (message.action) {
    case 'register':
      registerPlayer()
      break
    case 'unregister':
      unregisterPlayer()
      break
    case 'update-status':
      if (player == null)
        return
      status = message.status
      if ('paused' in status && !status.paused)
        player.playbackStatus = 'Playing'
      else
        player.playbackStatus = 'Paused'
      // sec to us
      if ('currentTime' in status)
        playerCurrentTime = status.currentTime * 1000 * 1000
      let metadata = {
        'mpris:trackid': player.objectPath('track/0')
      }
      // sec to us
      if ('duration' in status)
        metadata['mpris:length'] = status.duration * 1000 * 1000
      if ('artUrl' in status)
        metadata['mpris:artUrl'] = status.artUrl
      if ('title' in status)
        metadata['xesam:title'] = status.title
      player.metadata = metadata
      player.canSeek = 'currentTime' in status && 'duration' in status
      player.volume = status.volume
      player.rate = status.playbackRate
      break
  }
})
