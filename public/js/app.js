App = new Backbone.Marionette.Application();

App.PPS = 20

App.addRegions({
  tracks: '#mix .stage',
  effect: '.effect-panel',
  footer: '#footer',
  header: 'header',
  playhead: '#play-head'
});

App.on("start", function(options) {
  var mixURL = options.mixURL
    , ac = new webkitAudioContext()
    , mix = new App.Models.Mix({context: ac});

  window.mix = mix;

  mix.fetch();

  mix.on('regionLoaded', function(){
    var total = mix.get('regions')
      , loaded = mix.get('loaded');
    console.log('Loaded ' + loaded + ' of ' + total + ' assets');
  });

  App.footer.show(new App.Views.FooterControls);
  App.playhead.show(new App.Views.PlayHead);

  mix.on('ready', function() {
    App.tracks.show(new App.Views.TrackCollection({
      collection: mix.tracks
    }));

    App.header.show(new App.Views.HeaderView)
  });

  // expose the mix Model so we can fuck with it in the console
  window.mix = mix;
});
