class TwitchController extends AbstractController {
  constructor() {
    super({
      title: ['h2.tw-font-size-4', '.tw-mg-b-05 > p:nth-child(1) >' +
              'span:nth-child(1)',
              '.tw-card-body > div:nth-child(1) > p:nth-child(1) >' +
              'span:nth-child(1)']
    })
  }

  canSeek() {
    return $('.seekbar-interaction-area') != null
  }
}

window.mediaObserver = null

function registeredCallback() {
  window.mediaObserver = autoUpdateStatus(window.controller)
}

function unregisteredCallback() {
  window.mediaObserver.disconnect()
}

window.controller = new TwitchController()
mutationObserverAutoRegister(window.controller, registeredCallback, unregisteredCallback)
