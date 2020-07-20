class NetflixController extends AbstractController {
  constructor() {
    super({
      playNext: '.button-nfplayerNextEpisode',
      title: '.ellipsize-text'
    })
    this.netflixPlayer = `var videoPlayer = window.netflix
      .appContext
      .state
      .playerApp
      .getAPI()
      .videoPlayer;
    var id = videoPlayer.getAllPlayerSessionIds()[0];
    var player = videoPlayer.getVideoPlayerBySessionId(id);`
  }

  get currentTime() {
    return super.currentTime
  }

  set currentTime(currentTime) {
    let code = this.netflixPlayer + `
    player.seek(${currentTime} * 1000);`
    this.execute(code)
  }

  get volume() {
    return super.volume
  }

  set volume(volume) {
    let code = this.netflixPlayer + `
    player.setVolume(${volume});`
    this.execute(code)
  }
}

function registeredCallback() {
  window.mediaObserver = autoUpdateStatus(window.controller)
}

function unregisteredCallback() {
  window.mediaObserver.disconnect()
}

window.mediaObserver = null
window.controller = new NetflixController()
mutationObserverAutoRegister(
    window.controller, registeredCallback, unregisteredCallback)
