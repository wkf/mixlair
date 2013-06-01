App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
  Views.FooterControls = Backbone.Marionette.ItemView.extend({
    template: "#footer-template",
    tagName: "div",
    ui: {
      'beginning': '.beginning',
      'rewind': '.rewind',
      'play': '.play',
      'record': '.record',
      'ffwd': '.ffwd',
      'end': '.end',
      'time': '.time .count',
      'tempo': '.tempo .count'
    },
    events: {
      'click .beginning': 'beginning',
      'click .rewind': 'rewind',
      'click .play': 'playMix',
      'click .ffwd': 'ffwd',
      'click .end': 'end',
    },
    initialize: function(){
      this.listenTo(mix, 'timeUpdate', this.timeUpdate);
      this.listenTo(mix, 'bpmUpdate', this.bpmUpdate);
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
    // play or pause
    playMix: function( e ){
      if ( mix.get('playing') ){
        mix.pause();
        this.ui.play.removeClass('playing');
      } else {
        mix.play();
        this.ui.play.addClass('playing');
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
      this.ui.time.text(strFormat);
    },
    bpmUpdate: function(){
      var bpm = mix.get('bpm');
      this.ui.tempo.text(bpm);
    }
  });
});
