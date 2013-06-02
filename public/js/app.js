App = new Backbone.Marionette.Application();

App.addRegions({
  tracks: '#mix',
  effect: '.effect-panel',
  footer: '#footer'
});

App.on("start", function(options) {
  var mixURL = options.mixURL
    , ac = new webkitAudioContext()
    , mix = new App.Models.Mix({context: ac});

  window.mix = mix;

  mix.fetch();

  App.footer.show(new App.Views.FooterControls);

  mix.on('ready', function() {
    App.tracks.show(new App.Views.TrackCollection({
      collection: mix.tracks
    }));
  });

  // expose the mix Model so we can fuck with it in the console
  window.mix = mix;
});
