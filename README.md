# Schmidt's Katz

Control your music and videos with Schmidt's Katz's keyboard shortcuts.
This plugin aims to be feature-complete - you can change volume, seek or even modify the playback rate using keystroke commands.
To use shortcuts outside Firefox, a native interface integrates this plugin into MPRIS on Linux.

## Supported Browsers
- Firefox
- Chromium
- Google Chrome
- Probably other Chromium based browser

## Build

After clone, run `yarn ${browser}` to prepare building for a specific browser and to install mpris if you are on linux.
Browser must be one of the following:
- firefox
- chromium
- google-chrome

## MPRIS

`yarn ${browser}` installs mpris manifest file.

## Changelog

### 1.2

scrollbar fix
mpris fix
chrome support

## Documentation

This plugin tries to use as many features of the standard html5 audio/video api.
Unluckily most websites build their own implementations around the html5 standard, so we try to get around issues in the most general way.

### files

#### abstract_controller

TODO:
constructor parameter optional


#### media_interceptor

overrides `window.createElement` to get access to all created video/audio elements, which are not attached to the DOM.
These are then attached the DOM in a div with id 'skMedias' for further use in a controller.

#### base_code_patcher

adds a `patch` function, which accepts a url pattern, regex to search for code and replacement code.
This function can be used as last measurement to get access to privately defined functions to access media player functionality.

### permissions

- `webRequest`, `webRequestBlocking` and `urls` to adapt content security policy
- `activeTab` to find out when user changed tabs
- `nativeMessaging` for MPRIS

## TODOs

- CI/test playback rate/artwork
- Popup
  - scroll title
  - grid layout
- Integration tests
- disable class depending on for attribute: https://stackoverflow.com/questions/1186416/jquery-selector-for-the-label-of-a-checkbox#1186423
- Window 10 media overlay
