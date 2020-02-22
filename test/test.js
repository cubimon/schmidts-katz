#!/usr/bin/node
const assert = require('assert')
const fs = require('fs')
const {Builder} = require('selenium-webdriver')
const firefox = require('selenium-webdriver/firefox')
const chrome = require('selenium-webdriver/chrome')
const geckodriver = require("geckodriver")
const {Command} = require('selenium-webdriver/lib/command')
let dbus = require('dbus-next')
let Variant = dbus.Variant
let bus = dbus.sessionBus()

function currentTimeMillis() {
  let [seconds, nanoseconds] = process.hrtime()
  return seconds * 1000 + nanoseconds / (1000 * 1000)
}

async function assertTimeout(func, timeout) {
  let startTime = currentTimeMillis()
  while(currentTimeMillis() - startTime < timeout) {
    if (await func()) {
      assert.ok(true)
      return
    }
  }
  assert.fail("timeout, condition never evaluated true")
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// TODO: test set time
// TODO: duration
// TODO: video register if time was found
class MPRISPlayer {

  constructor(name) {
    this.name = name
  }

  get playerDbusName() {
    return `org.mpris.MediaPlayer2.${this.name}`
  }

  async waitPlayer() {
    console.log('waiting for mpris player')
    let dbusProxy = await bus.getProxyObject(
      'org.freedesktop.DBus', '/org/freedesktop/DBus')
    let dbusIface = dbusProxy.getInterface(
      'org.freedesktop.DBus')
    let startTime = currentTimeMillis()
    while (true) {
      if (currentTimeMillis() - startTime > 10000)
        assert.fail("timed out waiting for mpris player")
      let dbusNames = await dbusIface.ListNames()
      for (let dbusName of dbusNames) {
        if (dbusName == this.playerDbusName) {
          console.log('found player')
          return
        }
      }
    }
  }

  async init() {
    await this.waitPlayer()
    let playerProxy = await bus.getProxyObject(
      this.playerDbusName, '/org/mpris/MediaPlayer2')
    this.playerIface = playerProxy.getInterface(
      'org.mpris.MediaPlayer2.Player')
    this.propertiesIface = playerProxy.getInterface(
      'org.freedesktop.DBus.Properties')
  }

  async getCurrentTime() {
    let currentTime = await this.getProperty('Position')
    let seconds = currentTime / (1000n * 1000n)
    let rest = (currentTime - seconds * (1000n * 1000n))
    seconds = Number(seconds)
    let milliseconds = Number(rest) / (1000 * 1000)
    return seconds + milliseconds
  }

  async setCurrentTime(currentTime) {
    await this.setProperty('Position', 'v', currentTime * 1000n * 1000n)
  }

  async getVolume() {
    return await this.getProperty('Volume')
  }

  async setVolume(volume) {
    await this.setProperty('Volume', 'd', volume)
  }

  async play() {
    await this.playerIface.Play()
  }

  async pause() {
    await this.playerIface.Pause()
  }

  async getProperty(name) {
    let property = await this.propertiesIface.Get(
      'org.mpris.MediaPlayer2.Player', name)
    return property.value
  }

  async setProperty(name, type, value) {
    await this.propertiesIface.Set(
      'org.mpris.MediaPlayer2.Player', name, new Variant(type, value))
  }
}

//function readFileBase64(filename) {
//  var stream = fs.readFileSync(filename)
//  return Buffer.from(stream).toString('base64')
//}

async function main() {
  let firefoxOptions = new firefox.Options()
    .setPreference('media.autoplay.default', 0)
  //  .setBinary('/usr/bin/firefox-developer-edition')
  //let chromeOptions = new chrome.Options()
  //  .addExtensions(readFileBase64('./release.crx'))
  //let driver = await new Builder()
  //  .forBrowser('firefox')
  //  .setFirefoxOptions(firefoxOptions)
  //  .setChromeOptions(chromeOptions)
  //  .build()
  let driver = await new Builder()
    .forBrowser("firefox")
    .setFirefoxOptions(firefoxOptions)
    .setFirefoxService(new firefox.ServiceBuilder(geckodriver.path))
    .build()

  const command = new Command("install addon")
    .setParameter("path", process.cwd())
    .setParameter("temporary", true)

  try {
    await driver.execute(command)
    await driver.get('https://www.youtube.com/watch?v=Xk81pq2d_BQ')
    let player = new MPRISPlayer('Schmidts_Katz')
    await player.init()
    console.log('wait until some video time passed')
    while (await player.getCurrentTime() < 1.0) {
      // wait until some time in video passed
      await sleep(1000)
    }
    console.log(`video start time: ${await player.getCurrentTime()}`)
    // time
    let startTime = await player.getCurrentTime()
    console.log(`startTime: ${startTime}`)
    await player.play()
    await sleep(1000)
    await player.pause()
    let endTime = await player.getCurrentTime()
    console.log(`endTime: ${endTime}`)
    let duration = endTime - startTime
    console.log(`duration: ${duration}`)
    assert(duration < 1.2 && duration > 0.8)
    // volume
    await player.setVolume(0.8)
    await assertTimeout(async () => await player.getVolume() == 0.8, 2000)
    console.log(`volume: ${await player.getVolume()}`)
    await player.setVolume(0.42)
    await assertTimeout(async () => await player.getVolume() == 0.42, 2000)
    console.log(`volume: ${await player.getVolume()}`)
  } finally {
    //await driver.quit()
  }
}

main()
