App = new Backbone.Marionette.Application();

App.PPS = 13

App.addRegions({
  tracks: '#mix .stage',
  effects: '.effect-panel .list',
  footer: '#footer',
  header: 'header',
  playhead: '#play-head'
});

App.on("start", function(options) {
  var mixURL = options.mixURL
    , ac = new webkitAudioContext()
    , mix = new App.Models.Mix({context: ac});

  window.mix = mix;

  mix.on('regionLoaded', function(){
    var total = mix.get('regions')
      , loaded = mix.get('loaded');

    $('.loader .bar').css('width', loaded/total*100 + '%');
  });

  App.footer.show(new App.Views.FooterControls);
  App.playhead.show(new App.Views.PlayHead);

  mix.on('ready', function() {

    $('.loader').fadeOut();
    $('#play-head').fadeIn();

    App.tracks.show(new App.Views.TrackCollection({
      collection: mix.tracks
    }));

    App.header.show(new App.Views.HeaderView);

    App.effects.show(new App.Views.effectsLayoutView);

  });

  mix.parse(MIX);

  // expose the mix Model so we can fuck with it in the console
  window.mix = mix;
});
