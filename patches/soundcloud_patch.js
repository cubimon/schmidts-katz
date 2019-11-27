patch(/.*assets\/1-.*/,
    'setupSound:function(e){e&&this.sound',
    'setupSound:function(e){window.skAudioPlayer=this;return e&&this.sound')