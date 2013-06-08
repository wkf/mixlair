App.module('util', function(util, App, Backbone, Marionette, $, _) {
  util.fx = [
    { name: 'compressor',
      params: {
        bypass: {
          ui: 'toggle',
          range: [0, 1],
          value: 1
        },
        threshold: {
          ui: 'slider',
          range: [-60, 0], 
          value: -20
        },
        release: {
          ui: 'slider',
          range: [10, 2000],
          value: 250
        },
        makeupGain: {
          ui: 'slider',
          range: [1, 100],
          value: 1
        },
        attack: {
          ui: 'slider',
          range: [0, 1000],
          value: 1
        },
        ratio: {
          ui: 'slider',
          range: [1, 50],
          value: 4
        },
        knee: {
          ui: 'slider',
          range: [0, 40],
          value: 5
        },
        automakeup: {
          ui: 'toggle',
          range: [0, 1],
          value: false
        }
      }
    },
    { name: 'chorus',
      params: {
        bypass: {
          ui: 'toggle', 
          range: [0, 1],
          value: 1
        },
        feedback: {
          ui: 'slider',
          range: [0, 0.95],
          value: 0.4
        },
        delay: {
          ui: 'slider',
          range: [0, 1],
          value: 0.0045
        },
        depth: {
          ui: 'slider',
          range: [0, 1],
          value: 0.7
        },
        rate: {
          ui: 'slider',
          range: [0, 8],
          value: 1.5
        }
      }
    },
    { name: 'tremolo',
      params: {
        bypass: {
          ui: 'toggle', 
          range: [0, 1],
          value: 1
        },
        intensity: {
          ui: 'slider',
          range: [0, 1],
          value: 0.3,
        },
        stereoPhase: {
          ui: 'slider',
          range: [0, 180],
          value: 0,
        },
        rate: {
          ui: 'slider',
          range: [0.1, 11],
          value: 5
        }
      }
    },
    { name: 'delay',
      params: {
        bypass: {
          ui: 'toggle', 
          range: [0, 1],
          value: 1
        },
        delayTime: {
          ui: 'slider',
          range: [20, 1000],
          value: 100
        },
        feedback: {
          ui: 'slider',
          range: [0, 0.9],
          value: 0.45
        },
        cutoff: {
          ui: 'slider',
          range: [20, 20000],
          value: 20000
        },
        wetLevel: {
          ui: 'slider',
          range: [0, 1],
          value: 0.5
        },
        dryLevel: {
          ui: 'slider',
          range: [0, 1],
          value: 1
        }
      }
    },
    { name: 'reverb',
      params: {
        bypass: {
          ui: 'toggle', 
          range: [0, 1],
          value: 1
        },
        highCut: {
          ui: 'slider',
          range: [20, 22050],
          value: 22050
        },
        lowCut: {
          ui: 'slider',
          range: [20, 22050],
          value: 20
        },
        dryLevel: {
          ui: 'slider',
          range: [0, 1],
          value: 1
        },
        wetLevel: {
          ui: 'slider',
          range: [0, 1],
          value: 1
        }
      }
    }
  ]
});
