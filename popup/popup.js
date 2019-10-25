let $ = document.querySelector.bind(document)

function toggleMute() {
  browser.runtime.sendMessage({
    action: 'toggle-mute'
  })
}

function setVolume() {
  let volume = $('#volume-slider').value
  browser.runtime.sendMessage({
    action: 'volume',
    volume: volume / 100
  })
}

function playPrev() {
  browser.runtime.sendMessage({
    action: 'play-prev'
  })
}

function backward() {
  browser.runtime.sendMessage({
    action: 'backward'
  })
}

function playPause() {
  browser.runtime.sendMessage({
    action: 'play-pause'
  })
}

function forward() {
  browser.runtime.sendMessage({
    action: 'forward'
  })
}

function playNext() {
  browser.runtime.sendMessage({
    action: 'play-next'
  })
}

function setCurrentTime() {
  let currentTime = $('#time-slider').value
  browser.runtime.sendMessage({
    action: 'current-time',
    currentTime: currentTime
  })
}

function like() {
  browser.runtime.sendMessage({
    action: 'like'
  })
}

function dislike() {
  browser.runtime.sendMessage({
    action: 'dislike'
  })
}

function timeToText(currentTime, duration) {
  // current time
  let currentTimeSec = Math.floor(currentTime % 60).toString().padStart(2, "0")
  currentTime = Math.floor(currentTime / 60)
  let currentTimeMin = Math.floor(currentTime % 60).toString().padStart(2, "0")
  currentTime = Math.floor(currentTime / 60)
  let currentTimeHour = Math.floor(currentTime % 60)

  // duration
  let durationSec = Math.floor(duration % 60).toString().padStart(2, "0")
  duration = Math.floor(duration / 60)
  let durationMin = Math.floor(duration % 60).toString().padStart(2, "0")
  duration = Math.floor(duration / 60)
  let durationHour = Math.floor(duration % 60).toString()

  // current time hour should be same width as duration time hour
  currentTimeHour = currentTimeHour.toString().padStart(durationHour.length, "0")

  let currentTimeLabel = `${currentTimeMin}:${currentTimeSec}`
  let durationLabel = `${durationMin}:${durationSec}`
  if (durationHour > 0) {
    currentTimeLabel = `${currentTimeHour}:${currentTimeLabel}`
    durationLabel = `${durationHour}:${durationLabel}`
  }
  return [currentTimeLabel, durationLabel]
}

function updateStatus(status) {
  if ('title' in status) {
    $('#title').innerText = status.title
    $('#title').title = status.title
    $('#title').classList.remove('disabled')
  } else {
    $('#title').innerText = '‒'
    $('#title').title = '‒'
    $('#title').classList.add('disabled')
  }
  if ('volume' in status) {
    let volume = Math.round(status.volume * 100)
    $('#volume-icon').classList.remove('disabled')
    $('#volume-slider').disabled = false
    $('#volume-slider').value = volume
    $('#volume-text').classList.remove('disabled')
    $('#volume-text').innerHTML = `${volume}%`
  } else {
    $('#volume-icon').classList.add('disabled')
    $('#volume-slider').disabled = true
    $('#volume-text').classList.add('disabled')
    $('#volume-text').innerHTML = '‒%' 
  }
  $('#play-prev').disabled = !status.canPlayPrev
  let canPlay = 'paused' in status
  $('#backward').disabled = !canPlay
  $('#play-pause').disabled = !canPlay
  if (canPlay && !status.paused) {
    $('#play-pause').firstElementChild.classList.remove('fa-play')
    $('#play-pause').firstElementChild.classList.add('fa-pause')
  } else {
    $('#play-pause').firstElementChild.classList.remove('fa-pause')
    $('#play-pause').firstElementChild.classList.add('fa-play')
  }
  $('#forward').disabled = !canPlay
  $('#play-next').disabled = !status.canPlayPrev
  if ('currentTime' in status && 'duration' in status) {
    let labels = timeToText(status.currentTime, status.duration)
    $('#time-current').innerHTML = labels[0]
    $('#time-current').classList.remove('disabled')
    $('#time-slider').value = Math.floor(status.currentTime)
    $('#time-slider').max = Math.floor(status.duration)
    $('#time-slider').disabled = false
    $('#time-duration').innerHTML = labels[1]
    $('#time-duration').classList.remove('disabled')
  } else {
    $('#time-current').innerHTML = '--:--'
    $('#time-current').classList.add('disabled')
    $('#time-slider').disabled = true
    $('#time-duration').innerHTML = '--:--'
    $('#time-duration').classList.add('disabled')
  }
  $('#forward').disabled = !canPlay
  $('#play-next').disabled = !status.canPlayNext
  $('#like').disabled = !status.canLike
  $('#dislike').disabled = !status.canDislike
}

window.addEventListener('DOMContentLoaded', (event) => {
  $('#volume-icon').addEventListener('onclick', this.toggleMute.bind(this))
  $('#volume-slider').addEventListener('change', this.setVolume.bind(this))
  $('#play-prev').addEventListener('onclick', this.playPrev.bind(this))
  $('#backward').addEventListener('onclick', this.backward.bind(this))
  $('#play-pause').addEventListener('onclick', this.playPause.bind(this))
  $('#forward').addEventListener('onclick', this.forward.bind(this))
  $('#play-next').addEventListener('onclick', this.playNext.bind(this))
  $('#time-slider').addEventListener('change', this.setCurrentTime.bind(this))
  $('#like').addEventListener('onclick', this.like.bind(this))
  $('#dislike').addEventListener('onclick', this.dislike.bind(this))
  browser.runtime.sendMessage({
    action: 'popup opened'
  })
})

window.addEventListener('unload', (event) => {
  browser.runtime.sendMessage({
    action: 'popup closed'
  })
})

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(`popup message: ${JSON.stringify(message)}`)
  switch (message.action) {
    case 'update-status':
      updateStatus(message.status)
      break
  }
})