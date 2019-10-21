const fs = require('fs')

const color = 'white'
const path = 'node_modules/@fortawesome/fontawesome-free/svgs/solid'
const files = [
    'play.svg',
    'pause.svg',
    'stop.svg',
    'step-backward.svg',
    'step-forward.svg',
    'fast-backward.svg',
    'fast-forward.svg',
    'volume-mute.svg',
    'volume-down.svg',
    'volume-up.svg',
    'backward.svg',
    'forward.svg',
    'thumbs-up.svg',
    'thumbs-down.svg',
]
for (let file of files) {
    fs.readFile(path + '/' + file, {encoding: 'utf-8'}, (error, data) => {
        if (error) throw error
        data = data.replace(/<svg/g, `<svg fill="${color}"`)
        fs.writeFile(`icons/fontawesome/${file}`, data, (error) => {
            if (error) throw error
        })
    })
}
