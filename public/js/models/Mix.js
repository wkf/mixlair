App.module("Models", function(Models, App, Backbone, Marionette, $, _) {
  Models.Mix = Backbone.Model.extend({
    url: 'mix.json',
    // default params
    defaults: {
      bpm: 120,
      position: 0,
      startTime: 0,
      playing: false,
      clicking: false,
      maxTime: Infinity,
      volume: 1,
      dBFS: -192
    },

    snapTime: function( seconds ){
      var bpm = this.get('bpm')
        , beatlength = 60 / bpm
        , mod = seconds % beatlength
        , down = seconds - mod
        , up = seconds + ( beatlength - mod )
        , downdiff = seconds - down
        , updiff = up - seconds
      return updiff < downdiff ? up : down;
    },

    // get things started
    initialize: function(){
      this.tracks = new App.Collections.Tracks;
      this.downloader = new Downloader(function(){
        this.trigger('ready');
      }.bind(this));
      this.updatePosition();
      this.connect();
      this.on('change:position', function(){
        this.get('playing') && this.play();
      });
      this.on('change:volume', function(){
        this.get('input').gain.value = this.get('volume');
      });
      this.on('change:bpm', function(){
        this.trigger('bpmUpdate');
      });
      this.on('change:bpm', _.debounce(function(){
        var clicking = !!this.get('clicking')
          , bpm = this.get('bpm');
        if ( clicking ){
          this.startClick();
        }
      }, 150));
    },

    connect: function(){
      var ac = this.get('context')
        , click = new Metronome(ac)
        , meter = new Meter(ac);
      this.set('click', click);
      this.set('input', ac.createGain());
      this.set('meter', meter);
      this.get('input').connect(ac.destination);
      this.get('input').connect(this.get('meter').input);
      this.get('meter').ondBFS(function( dBFS ){
        this.set('dBFS', dBFS);
        this.trigger('meter');
      }.bind(this));
      this.tracks.connectAll();
    },

    // begin playback of all tracks
    play: function(){
      var now = this.acTime()
        , clicking = this.get('clicking')
        , position = this.get('position');
      this.set('startTime', now - position);
      this.set('maxTime', this.tracks.maxTime());
      this.tracks.play();
      this.trigger('play');
      clicking && this.startClick();
      return this.set('playing', true);
    },

    // pause all tracks
    pause: function(){
      var clicking = this.get('clicking');
      this.tracks.pause();
      this.trigger('pause');
      this.stopClick();
      this.set('clicking', clicking);
      return this.set('playing', false);
    },

    // pause and set position back to 0
    stop: function(){
      return this.pause().set('position', 0, {silent: true});
    },

    // rewind to 0 and play
    rewind: function(){
      return this.stop().play();
    },

    // AudioContext.currentTime
    acTime: function(){
      return this.get('context').currentTime;
    },

    // get the exact playback position of the mix (in seconds)
    getPosition: function(){
      var now = this.acTime()
        , playing = this.get('playing')
        , start = this.get('startTime')
        , position = this.get('position')
        , delta = now - start
        , recording = !!this.getRecordingTracks();
      return playing ? delta : position;
    },

    // periodically update the position attribute
    updatePosition: function(){
      var position = this.getPosition()
        , playing = this.get('playing')
        , recording = !!this.getRecordingTracks()
        , maxTime = this.get('maxTime');
      this.set('position', position, {silent: true});
      this.trigger('timeUpdate');
      playing && !recording && position > maxTime && this.stop();
      setTimeout(this.updatePosition.bind(this), 16);
    },

    // selectively apply/remove mutes depending on which tracks
    // are soloed and unsoloed
    soloMute: function(){
      var unsoloed = this.tracks.where({soloed: false})
        , soloed = this.tracks.where({soloed: true})
        , _muted = this.tracks.where({_muted: true})
        , muted = this.tracks.where({muted: true});
      // apply _mute to non-soloed tracks
      if ( soloed.length ){
        unsoloed.forEach(function( track ){
          track._mute();
        });
      }
      // remove _mute when nothing is soloed
      if ( !soloed.length ){
        _muted.forEach(function( track ){
          track._unmute();
        });
      }
    },

    // create a new track and add it to the tracks collection
    createTrack: function(name){
      this.tracks.add({
        name: name,
        context: this.get('context'),
        output: this.get('input'),
        collection: this.tracks,
        mix: this
      });
      return this.trigger('createTrack');
    },

    // returns the number of currently recording tracks
    getRecordingTracks: function(){
      return this.tracks.where({recording: true}).length;
    },

    switchContext: function( ac ){
      this.set('context', ac);
      this.connect();
      return this;
    },

    goOffline: function(){
      var ac, maxtime, sr;
      this.stop();
      maxtime = this.get('maxTime');
      sr = this.get('context').sampleRate;
      ac = new webkitOfflineAudioContext(2, maxtime * sr, sr);
      return this.switchContext(ac);
    },

    goOnline: function(){
      var ac = new webkitAudioContext();
      this.stop();
      return this.switchContext(ac);
    },

    bounce: function(){
      var count = this.tracks.length
        , start = Date.now()
        , tape
        , ac;
      this.goOffline();
      ac = this.get('context');
      console.log('rendering ' + count + ' tracks.');
      ac.oncomplete = function( ev ){
        console.log('render time: ' + ( Date.now() - start ) + ' ms.');
        Archiver.save(ev.renderedBuffer, 'mix.wav');
        this.goOnline();
      }.bind(this);
      mix.play();
      ac.startRendering();
      return this;
    },

    startClick: function(){
      var click = this.get('click')
        , pos = this.getPosition()
        , bpm = this.get('bpm');
      this.set('clicking', true);
      click.stop();
      click.setBpm(bpm);
      click.start(pos);
    },

    stopClick: function(){
      this.set('clicking', false);
      this.get('click').stop();
    },

    requestInput: function(){
      navigator.webkitGetUserMedia({audio: true}, function(stream){
        mix.set('inputEnabled', true);
        mix.set('recStream', stream);
      }.bind(this), function(){
        console.log('couldn\'t get a stream');
      });
    },

    toJSON: function(){
      return {
        bpm: this.get('bpm'),
        tracks: this.tracks.toJSON()
      }
    },

    parse: function( data ){
      var tracks = data.tracks;
      if ( data.bpm ) this.set('bpm', data.bpm);
      tracks.forEach(function( trackData ){
        var track = new App.Models.Track({
          name: trackData.name,
          volume: trackData.volume,
          output: this.get('input'),
          collection: this.tracks,
          pluginParams: trackData.pluginParams || {},
          mix: mix,
          regions: trackData.regions
        });
      this.tracks.add(track);
      }.bind(this));
    }

  });
});
