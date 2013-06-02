$().ready(init);

function init() {
  App.start({
    mixURL: 'mix.json'
  });

  $('.effect-panel .close').on('click', function(){
    $(this).closest('.effect-panel').slideUp();
    $('.fx').removeClass('active')
  });

}
