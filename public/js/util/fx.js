App.module('util', function(util, App, Backbone, Marionette, $, _) {
  util.fx = [
    { name: 'compressor',
      params: {
        bypass: {
          range: [0, 1],
          value: 1
        },
        threshold: {
          range: [-60, 0], 
          value: -20
        },
        release: {
          range: [10, 2000],
          value: 250
        },
        makeupGain: {
          range: [1, 100],
          value: 1
        },
        attack: {
          range: [0, 1000],
          value: 1
        },
        ratio: {
          range: [1, 50],
          value: 4
        },
        knee: {
          range: [0, 40],
          value: 5
        },
        automakeup: {
          range: [0, 1],
          value: false
        }
      }
    },
    { name: 'chorus',
      params: {
        bypass: {
          range: [0, 1],
          value: 1
        },
        feedback: {
          range: [0, 0.95],
          value: 0.4
        },
        delay: {
          range: [0, 1],
          value: 0.0045
        },
        depth: {
          range: [0, 1],
          value: 0.7
        },
        rate: {
          range: [0, 8],
          value: 1.5
        }
      }
    },
    { name: 'tremolo',
      params: {
        bypass: {
          range: [0, 1],
          value: 1
        },
        intensity: {
          range: [0, 1],
          value: 0.3,
        },
        stereoPhase: {
          range: [0, 180],
          value: 0,
        }
        rate: {
          range: [0.1, 11],
          value: 5
        }
      }
    },
    { name: 'delay',
      params: {
        bypass: {
          range: [0, 1],
          value: 1
        },
        delayTime: {
          range: [20, 1000],
          value: 100
        }
        feedback: {
          range: [0, 0.9],
          value: 0.45
        },
        cutoff: {
          range: [20, 20000],
          value: 20000
        },
        wetLevel: {
          range: [0, 1],
          value: 0.5
        },
        dryLevel: {
          range: [0, 1],
          value: 1
        }
      }
    },
    { name: 'reverb',
      params: {
        bypass: {
          range: [0, 1],
          value: 1
        },
        highCut: {
          range: [20, 22050],
          value: 22050
        },
        lowCut: {
          range: [20, 22050],
          value: 20
        },
        dryLevel: {
          range: [0, 1],
          value: 1
        },
        wetLevel: {
          range: [0, 1],
          value: 1
        }
      }
    }
  ]
});
