$().ready(init);

function init() {

  // start audio portion
  App.start({
    mixURL: 'mix.json'
  });

  // initialize timeline
  a = new timelineGrid({
    pps: 50,
    seconds: 100,
    fillStyle: "rgb(112, 118, 128)",
    height: 6,
    lineWidth: 2,
    appendTo: document.querySelector('header .timeline')
  });

  // volume slider
  $('#playback-volume').slider({
    slide: function(e, ui){
      $('#playback-volume .alt').css({ width: ui.value + "%" })
    },
    value: 65
  });

  // tempo slider
  $('.tempo').on('dragstart', function(){
    $('body').css('cursor', 'ew-resize')
  }).on('dragend', function(){
    $('body').css('cursor', 'auto')
  });

}
