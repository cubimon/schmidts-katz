# Schmidt's Katz

Control your music and videos with Schmidt's Katz's keyboard shortcuts.
This plugin aims to be feature-complete - you can change volume, seek or even change the playback rate using keystroke commands.
To use shortcuts outside Firefox, a native interface integrates this plugin into MPRIS on Linux.

## Build

After clone, run `npm i` and `make prepare`, if it wasn't run automatically by `npm i`.
To create release zip, run `make zip`.

## MPRIS

- make sure you have `node` and `npm` installed
- clone this repo
- run `npm i` in the repository
- next run `make mpris` in the repository, this will create `~/.mozilla/native-messaging-hosts/mpris.json` with a link to `mpris.js` in the cloned repo.
- to test, you may use the `playerctl` application

## TODOs

- Support for other websites than youtube
- test playback rate/artwork
- Popup
  - scroll title
  - grid layout
- Integration tests
- disable class depending on for attribute: https://stackoverflow.com/questions/1186416/jquery-selector-for-the-label-of-a-checkbox#1186423
- Window 10 media overlay

