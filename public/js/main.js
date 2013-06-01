$().ready(init);

function init() {
  App.start({
    mixURL: 'mix.json'
  });

  a = new timelineGrid({
    pps: 50,
    seconds: 100,
    fillStyle: "rgb(112, 118, 128)",
    height: 6,
    lineWidth: 2,
    appendTo: document.querySelector('header .timeline')
  });
}
