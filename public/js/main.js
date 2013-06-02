$().ready(init);

function init() {

  // start audio portion
  App.start({
    mixURL: 'mix.json'
  });

  // initialize timeline
  a = new timelineGrid({
    pps: App.PPS,
    seconds: 100,
    fillStyle: "rgb(112, 118, 128)",
    height: 6,
    lineWidth: 2,
    appendTo: document.querySelector('header .timeline')
  });
}
