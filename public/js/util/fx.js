App.module('util', function(util, App, Backbone, Marionette, $, _) {
  util.fx = [
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
});
