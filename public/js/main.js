require.config({

  shims: {
    jquery: { exports: '$' },
    underscore: { exports: '_' },
    backbone: { deps: ['underscore', 'jquery'], exports: 'Backbone' },
    marionette: { deps: ['jquery', 'underscore', 'backbone'], exports: 'Marionette' },
    meter: { exports: 'Meter' },
    tuna: { exports: 'Tuna' }
  },

  paths: {
    // deps
    jquery: 'vendor/jquery-1.9.1',
    underscore: 'vendor/underscore',
    backbone: 'vendor/backbone',
    marionette: 'vendor/marionette.1.0.3',

    // app
    app: 'app',
    init: 'init',
    mix: 'models/mix',
    region: 'models/region',
    track: 'models/track',
    plugin: 'models/plugin',

    // collections
    regions: 'collections/regions',
    tracks: 'collections/tracks',
    plugins: 'collections/plugins',

    // helpers
    tuna: 'vendor/tuna',
    metronome: 'Metronome',
    archiver: 'Archiver',
    downloader: 'Downloader',
    meter: 'Meter'
  }

});

require(['app', 'init'], function(App){

  // workaround for a bug with facebook's oauth implementation
  if (window.location.hash && window.location.hash == '#_=_'){
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname)
    } else {
      scrollTop = document.body.scrollTop;
      scrollLeft = document.body.scrollLeft;
      window.location.hash = '';
      document.body.scrollTop = scrollTop;
      document.body.scrollLeft = scrollLeft;
    }
  }

  App.start({ bpm: 85, mixURL: 'mix.json' });

});