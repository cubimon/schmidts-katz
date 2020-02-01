#!/usr/bin/node

const fs = require('fs')
const glob = require('glob')
const archiver = require('archiver')

const homedir = require('os').homedir()
// location where mpris.js is located
const nativeScriptPath = process.cwd()
// create intermediate directories w.o. throwing errors
const mkdirOptions = {
  recursive: true
}
// glob source without deps/build files/mpris
const globOptions = {
  ignore: [
    'node_modules/**',
    'build.js',
    'mpris.js'
  ]
}


if (process.argv.length < 3) {
  console.log('must pass one parameter/target')
  return -1
}

function replaceInFile(file, replacements) {
  fs.readFile(file, (error, data) => {
    if (error) throw error
    data = data.toString()
    for (let replacement of replacements) {
      data = data.replace(replacement[0], replacement[1])
    }
    fs.writeFile(file, data, (error) => {
      if (error) throw error
    })
  })
}

function replaceInFiles(pattern, replacements) {
  glob(pattern, globOptions, (error, files) => {
    if (error) throw error
    for (let file of files) {
      replaceInFile(file, replacements)
    }
  })
}

function prepare() {
  const fontawesomeNpmPath = 'node_modules/@fortawesome/fontawesome-free'
  const fontawesomeTargetPath = 'icons/fontawesome'
  fs.mkdirSync(fontawesomeTargetPath + '/css/', mkdirOptions)
  fs.mkdirSync(fontawesomeTargetPath + '/webfonts/', mkdirOptions)
  fs.copyFileSync(`${fontawesomeNpmPath}/css/all.min.css`,
          `${fontawesomeTargetPath}/css/all.min.css`)
  fs.copyFileSync(`${fontawesomeNpmPath}/webfonts/fa-solid-900.ttf`,
          `${fontawesomeTargetPath}/webfonts/fa-solid-900.ttf`)
  fs.copyFileSync(`${fontawesomeNpmPath}/webfonts/fa-solid-900.woff2`,
          `${fontawesomeTargetPath}/webfonts/fa-solid-900.woff2`)
  fs.copyFileSync(`${fontawesomeNpmPath}/webfonts/fa-solid-900.woff`,
          `${fontawesomeTargetPath}/webfonts/fa-solid-900.woff`)
}

function prepareFirefox() {
  replaceInFiles('**/*.js', [
    [/chrome\./g, 'browser.']
  ])
}

function prepareChrome() {
  replaceInFiles('**/*.js', [
    [/browser\./g, 'chrome.']
  ])
}

function mprisFirefox() {
  const mprisManifestPath = homedir + '/.mozilla/native-messaging-hosts'
  let targetFile = `${mprisManifestPath}/schmidts_katz_mpris.json`
  fs.mkdirSync(mprisManifestPath, mkdirOptions)
  fs.copyFileSync(`mpris.json`, targetFile)
  replaceInFile(targetFile, [
    [/\$\{path\}/g, nativeScriptPath],
    [/\$\{allowed_extension\}/g, 'schmidts_katz@cubimon.org'],
    [/allowed_origins/g, 'allowed_extensions']
  ])
}

function mprisChrome() {
  const mprisManifestPath = homedir + '/.config/chromium/NativeMessagingHosts'
  let targetFile = `${mprisManifestPath}/schmidts_katz_mpris.json`
  fs.mkdirSync(mprisManifestPath, mkdirOptions)
  fs.copyFileSync(`mpris.json`, targetFile)
  replaceInFile(targetFile, [
    [/\$\{path\}/g, nativeScriptPath],
    [/\$\{allowed_extension\}/g,
      'chrome-extension://afjbcphlhomgmdfnhondkjglafgbejdm/'],
    [/allowed_extensions/g, 'allowed_origins']
  ])
}

function zip() {
  let buildStream = fs.createWriteStream('release.zip')
  let archive = archiver('zip')
  archive.pipe(buildStream)
  let patterns = [
      '**/*.js',
      'manifest.json',
      'icons/icon128.png',
      'icons/fontawesome/css/*',
      'icons/fontawesome/webfonts/*'
  ]
  for (let pattern of patterns) {
      for (file of glob.sync(pattern, globOptions)) {
        archive.file(file)
      }
  }
  archive.finalize()
}

let targets = [
  prepare,
  prepareFirefox,
  prepareChrome,
  mprisFirefox,
  mprisChrome,
  zip
]

for (let target of targets) {
  if (target.name == process.argv[2]) {
    target()
  }
}
