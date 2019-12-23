// expose twitch's private video player for use in this extension, to seek in videos
patch(/.*player-core-base-.*/,
    'e.prototype.onStateChanged=function(e){',
    'e.prototype.onStateChanged=function(e){window.skVideoPlayer=this;')


