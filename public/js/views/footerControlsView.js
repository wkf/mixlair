App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
  Views.FooterControls = Backbone.Marionette.ItemView.extend({
    template: "#footer-template",
    tagName: "div",
    className: "contain",

    ui: {
      'beginning': '.beginning',
      'rewind': '.rewind',
      'play': '.play',
      'record': '.record',
      'ffwd': '.ffwd',
      'end': '.end',
      'time_count': '.time .count',
      'tempo_count': '.tempo .count',
      'volume': '#playback-volume',
      'volume_alt': '#playback-volume .alt',
      'tempo': '.tempo',
      'metronome': '.metronome',
      'ticker': '.metronome .ticker',
      'body': 'body',
      'zoom': '#zoom-slider'
    },

    events: {
      'click .beginning': 'beginning',
      'click .rewind': 'rewind',
      'click .play': 'playMix',
      'click .record': 'record',
      'click .ffwd': 'ffwd',
      'click .end': 'end',
      'click .metronome': 'metronome'
    },

    initialize: function(){
      this.listenTo(mix, 'timeUpdate', this.timeUpdate);
      this.listenTo(mix, 'bpmUpdate', this.bpmUpdate);
      this.listenTo(mix, 'ready', this.bindSpace);
      this.listenTo(mix, 'meter', this.meter);
      this.listenTo(mix, 'play', this.swapPlayClass);
      this.listenTo(mix, 'pause', this.swapPlayClass);
      this.listenTo(mix, 'recordStart', this.swapRecordClass);
      this.listenTo(mix, 'recordStop', this.swapRecordClass);
      this.listenTo(mix, 'clickStart', this.swapClickClass);
      this.listenTo(mix, 'clickStop', this.swapClickClass);
      this.clickInterval = null;
      this.tickerMoved = false;
    },

    onShow: function(){
      var alt = this.ui.volume_alt
        , body = this.ui.body
        , dragPos
        , bpm;

      // zoom slider
      this.ui.zoom.slider({
        slide: function(e, ui){
          mix.zoom(ui.value);
        },
        min: 5,
        max: 155,
        step: 10,
        value: App.PPS
      });


      // volume slider
      this.ui.volume.slider({
        slide: function(e, ui){
          mix.set('volume', ui.value / 100);
        },
        value: 65
      });

      // tempo slider
      this.ui.tempo.on('dragstart', function( e ){
        dragPos = e.pageX;
        bpm = mix.get('bpm');
        body.css('cursor', 'ew-resize');
      }).on('dragend', function(){
        body.css('cursor', 'auto');
      }).on('drag', function( e ){
        var delta = e.pageX - dragPos
          , newBpm = Math.round( bpm + ( delta / 5 ) );
        mix.set('bpm', newBpm);
      });
    },

    // jump to 0
    beginning: function(){
      mix.set('position', 0);
    },

    // jump back 10s
    rewind: function(){
      var pos = mix.get('position');
      mix.set('position', Math.max(0, pos - 10));
    },

    // jump ahead 10s
    ffwd: function(){
      var pos = mix.get('position')
        , max = mix.get('maxTime');
      mix.set('position', Math.min(max, pos + 10));
    },

    // jump to the end
    end: function(){
      var max = mix.get('maxTime');
      mix.pause().set('position', max);
    },

    metronome: function(){
      var clicking = mix.get('clicking');
      if ( clicking ){
        mix.stopClick();
      } else {
        mix.startClick();
      }
      this.animateMetronome();
    },
    animateMetronome: function(){
      var clicking = mix.get('clicking')
        , bpm = mix.get('bpm')
        , dur = 60 / bpm * 1000
        , self = this;
      clearInterval(this.clickInterval);
      if ( clicking ){
        this.clickInterval = setInterval(function(){
          if ( self.tickerMoved ){
            self.ui.ticker.removeClass('moved');
            self.tickerMoved = false;
          } else {
            self.ui.ticker.addClass('moved');
            self.tickerMoved = true;
          }
        }, dur);
      }
    },

    // play or pause
    playMix: function( e ){
      if ( mix.get('playing') ){
        mix.pause();
      } else {
        mix.play();
      }
    },

    record: function(){
      var active = mix.getActiveTrack()
        , recording = mix.get('recording');
      if ( !active ) return;
      if ( recording ){
        active.recordStop();
      } else {
        active.record();
      }
    },

    swapPlayClass: function(){
      if ( mix.get('playing') ){
        this.ui.play.addClass('playing');
      } else {
        this.ui.play.removeClass('playing');
      }
    },

    swapRecordClass: function(){
      if ( mix.get('recording') ){
        this.ui.record.addClass('recording');
      } else {
        this.ui.record.removeClass('recording');
      }
    },

    swapClickClass: function(){
      var clicking = mix.get('clicking');
      if ( clicking ){
        this.ui.metronome.addClass('active');
      } else {
        this.ui.metronome.removeClass('active');
      }
    },

    timeUpdate: function(){
      var pos = mix.get('position')
        , ms = Math.floor( ( pos * 1000 ) % 1000 )
        , s = Math.floor( pos % 60 )
        , m = Math.floor( ( pos * 1000 / ( 1000 * 60 ) ) % 60 )
        , strFormat = "MM:SS:XX";
      if( s < 10 ) s = "0" + s;
      if( m < 10 ) m = "0" + m;
      if( ms < 10 ) ms = "0" + ms;
      strFormat = strFormat.replace(/MM/, m);
      strFormat = strFormat.replace(/SS/, s);
      strFormat = strFormat.replace(/XX/, ms.toString().slice(0,2));
      this.ui.time_count.text(strFormat);
    },

    meter: function(){
      var db = mix.get('dBFS')
        , percentage = 100 + (db * 1.92);
      this.ui.volume_alt.css({ width: percentage + "%" });
    },

    bpmUpdate: function(){
      var bpm = mix.get('bpm');
      this.ui.tempo_count.text(bpm);
      this.animateMetronome();
    },

    bindSpace: function(){
      var self = this;
      $(window).on('keydown', function(e){

        if ( App.blockKeyEvents ) return;

        if (e.keyCode === 32) {
          self.playMix();
          return false
        }

        // bail for now - these can get annoying
        return;

        if (e.keyCode === 13) {
          self.beginning();
        }

        if (e.keyCode === 82) {
          self.record();
        }

        if (e.keyCode === 37) {
          self.rewind();
        }

        if (e.keyCode === 39) {
          self.ffwd();
        }

      });

    }
  });
});
