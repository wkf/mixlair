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
      'end': '.end'
    },
    events: {
      'click .beginning': 'beginning',
      'click .rewind': 'rewind',
      'click .play': 'playMix',
      'click .ffwd': 'ffwd',
      'click .end': 'end',
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
    }
  });
});
