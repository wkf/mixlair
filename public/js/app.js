App = new Backbone.Marionette.Application();

App.addRegions({
  tracks: '#mix',
  effect: '.effect-panel'
});

App.on("start", function(options) {
  var mixURL = options.mixURL
    , ac = new webkitAudioContext()
    , mix = new App.Models.Mix({context: ac});

    mix.fetch();

  // quick and dirty track layout so i can
  // see what the fuck i'm doing
  function drawMix(){
    var pps = 20;
    $('section').remove();
    mix.tracks.forEach(function( track ){
      var $section = $('<section/>').appendTo('body');
      track.regions.forEach(function( region ){
        var $div = $('<div/>').appendTo($section);
        region.on('change', function(){
          var start = region.get('start')
            , length = region.get('activeBuffer').duration;
          $div.css({left: start * pps, width: length * pps});
        });
        region.trigger('change');
      });
    });
    drawScrubber();
  }

  // draw the scrubber bar
  function drawScrubber(){
    var pps = 20
      , $scrubber = $('#scrubber')
      , left = mix.get('position');
    if ( !$scrubber.length ) {
      $scrubber = $('<span id="scrubber"/>').appendTo('body');
    }
    $scrubber.css('left', left * pps);
    requestAnimationFrame(drawScrubber)
  }

  mix.on('createTrack', drawMix);
  mix.on('recordStart', drawMix);
  mix.on('recordStop', drawMix);

  // expose the mix Model so we can fuck with it in the console
  window.mix = mix;
  window.drawMix = drawMix;

  // "instructions"
  console.log('play: mix.play()');
  console.log('pause: mix.pause()');
  console.log('set playback position: mix.set(\'position\', 20)');
  console.log('mute: mix.tracks.findWhere({name: \'Rhythm_1\'}).mute()');
  console.log('unmute: mix.tracks.findWhere({name: \'Rhythm_1\'}).unmute()');
  console.log('slice left: mix.tracks.findWhere({name: \'Rhythm_1\'}).regions.models[0].set(\'startOffset\', 30)');
  console.log('slice right: mix.tracks.findWhere({name: \'Rhythm_1\'}).regions.models[0].set(\'stopOffset\', 20)');
  console.log('start position: mix.tracks.findWhere({name: \'Rhythm_1\'}).regions.models[0].set(\'start\', 10)');

});
