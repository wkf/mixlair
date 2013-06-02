$().ready(init);

function init() {
  App.start({
    mixURL: 'mix.json'
  });

  if (!navigator.userAgent.match('Chrome')){
    $('.chrome_warning').show()
  }

}
