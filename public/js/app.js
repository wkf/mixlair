App = new Backbone.Marionette.Application();

App.PPS = 20

App.addRegions({
  tracks: '#mix .stage',
  effects: '.effect-panel .list',
  footer: '#footer',
  header: 'header',
  playhead: '#play-head'
});

// yes, this is terrible. but the track model is fucked
var fx = [
  { name: 'compressor',
    params: {
      bypass: 1,
      threshold: -20,
      release: 250,
      makeupGain: 1,
      attack: 1,
      ratio: 4,
      knee: 5,
      automakeup: false
    }
  },
  { name: 'chorus',
    params: {
      bypass: 1,
      feedback: 0.4,
      delay: 0.0045,
      depth: 0.7,
      rate: 1.5
    }
  },
  { name: 'tremolo',
    params: {
      bypass: 1,
      intensity: 0.3,
      stereoPhase: 0,
      rate: 5
    }
  },
  { name: 'delay',
    params: {
      bypass: 1,
      delayTime: 100,
      feedback: 0.45,
      cutoff: 20000,
      wetLevel: 0.5,
      dryLevel: 1
    }
  },
  { name: 'reverb',
    params: {
      bypass: 1,
      highCut: 22050,
      lowCut: 20,
      dryLevel: 1,
      wetLevel: 1,
      impulse: 'impulses/plate.wav',
    }
  }
]

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

    App.header.show(new App.Views.HeaderView);

    App.effects.show(new App.Views.effectsCollectionView({
      collection: new Backbone.Collection(fx)
    }));

  });

  // expose the mix Model so we can fuck with it in the console
  window.mix = mix;
});
