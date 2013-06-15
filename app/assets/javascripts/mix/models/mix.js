App.module("Models", function(Models, App, Backbone, Marionette, $, _) {
  Models.Mix = Backbone.RelationalModel.extend({
    url: '/user/' + MIX.user + '/mix/' + MIX._id,

    relations: [{
      type: Backbone.HasMany,
      key: 'tracks',
      relatedModel: 'App.Models.Track',
      collectionType: 'App.Collections.Tracks',
      reverseRelation: {
        key: 'mix_id'
      }
    }],

    // default params
    defaults: {
      bpm: 120,
      position: 0,
      startTime: 0,
      playing: false,
      clicking: false,
      maxTime: Infinity,
      volume: 1,
      dBFS: -192,
      regions: 0,
      loaded: 0
    },

    snapTime: function( seconds ){
      return seconds;
      var bpm = this.get('bpm')
        , beatlength = 60 / bpm
        , mod = seconds % beatlength
        , down = seconds - mod
        , up = seconds + ( beatlength - mod )
        , downdiff = seconds - down
        , updiff = up - seconds;
      return updiff < downdiff ? up : down;
    },

    // get things started
    initialize: function(){
      this.downloader = new Downloader(function(){
        this.trigger('ready');
      }.bind(this));
      this.updatePosition();
      //this.connect();
      this.on('change:position', function(){
        this.get('playing') && this.play();
      });
      this.on('change:volume', function(){
        if ( !this.get('input') ) return;
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
      this.on('change:loaded', function(){
        this.trigger('regionLoaded');
      });
      this.on('ready', function(){
        this.connect();
      });
      // Hack until i put real download progress stuff back in
      setTimeout(function(){
        this.trigger('ready');
      }.bind(this), 100);
    },

    connect: function(){
      var ac = App.ac
        , click = new App.Util.Metronome(ac)
        , meter = new App.Util.Meter(ac);
      this.set('click', click);
      this.set('input', ac.createGain());
      this.set('meter', meter);
      this.get('input').connect(ac.destination);
      this.get('input').connect(this.get('meter').input);
      this.get('meter').ondBFS(function( dBFS ){
        this.set('dBFS', dBFS);
        this.trigger('meter');
      }.bind(this));
      this.get('tracks').connectAll();
    },

    // begin playback of all tracks
    play: function(){
      var now = this.acTime()
        , clicking = this.get('clicking')
        , position = this.get('position');
      this.set('startTime', now - position);
      this.set('maxTime', this.get('tracks').maxTime());
      this.set('lastStartTime', position);
      this.get('tracks').play();
      clicking && this.startClick();
      this.set('playing', true);
      return this.trigger('play');
    },

    // pause all tracks
    pause: function(){
      var clicking = this.get('clicking');
      this.get('tracks').pause();
      this.stopClick();
      this.set('clicking', clicking);
      this.set('playing', false);
      return this.trigger('pause');
    },

    // pause and set position back to 0
    stop: function(){
      return this.pause().set('position', 0, {silent: true});
    },

    // rewind to 0 and play
    rewind: function(){
      return this.stop().play();
    },

    // rewind to the last position we played from
    toLastStartTime: function(){
      var lastStartTime = this.get('lastStartTime')
        , playing = !!this.get('playing');
      this.set('position', lastStartTime);
      playing && this.play();
    },

    // AudioContext.currentTime
    acTime: function(){
      return App.ac.currentTime;
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
      var unsoloed = this.get('tracks').where({soloed: false})
        , soloed = this.get('tracks').where({soloed: true})
        , _muted = this.get('tracks').where({_muted: true})
        , muted = this.get('tracks').where({muted: true});
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
      this.get('tracks').add({
        name: name,
        context: App.ac,
        output: this.get('input'),
        collection: this.get('tracks'),
        mix: this
      });
      return this.trigger('createTrack');
    },

    activateTrack: function( active ){
      active.set('active', true);
      this.get('tracks').forEach(function( track ){
        if ( active === track ) return;
        track.set('active', false);
      });
    },

    getActiveTrack: function(){
      return this.get('tracks').findWhere({active: true});
    },

    // returns the number of currently recording tracks
    getRecordingTracks: function(){
      return this.get('tracks').where({recording: true}).length;
    },

    switchContext: function( ac ){
      App.ac = ac;
      this.connect();
      return this;
    },

    goOffline: function(){
      var ac, maxtime, sr;
      this.stop();
      maxtime = this.get('maxTime');
      sr = App.ac.sampleRate;
      ac = new webkitOfflineAudioContext(2, maxtime * sr, sr);
      return this.switchContext(ac);
    },

    goOnline: function(){
      var ac = new webkitAudioContext();
      this.stop();
      return this.switchContext(ac);
    },

    bounce: function(){
      var count = this.get('tracks').length
        , start = Date.now()
        , tape
        , ac;
      this.goOffline();
      ac = App.ac;
      console.log('rendering ' + count + ' tracks.');
      ac.oncomplete = function( ev ){
        console.log('render time: ' + ( Date.now() - start ) + ' ms.');
        Archiver.save(ev.renderedBuffer, 'mix.wav');
        this.goOnline();
      }.bind(this);
      this.play();
      ac.startRendering();
      return this;
    },

    startClick: function(){
      var click = this.get('click')
        , pos = this.getPosition()
        , bpm = this.get('bpm');
      this.set('clicking', true);
      this.trigger('clickStart');
      click.stop();
      click.setBpm(bpm);
      click.start(pos);
    },

    stopClick: function(){
      this.set('clicking', false);
      this.trigger('clickStop');
      this.get('click').stop();
    },

    requestInput: function(){
      navigator.webkitGetUserMedia({audio: true}, function(stream){
        this.set('inputEnabled', true);
        this.set('recStream', stream);
      }.bind(this), function(){
        console.log('couldn\'t get a stream');
      });
    },

    toJSON: function(){
      return {
        bpm: this.get('bpm'),
        tracks: this.get('tracks').toJSON(),
        user: this.get('user')
      }
    },

  zoom: function( pps ){
      App.PPS = pps;
      this.trigger('zoom');
    }

  });
});
