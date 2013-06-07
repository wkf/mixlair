_.templateSettings = {
    interpolate: /\<\@\=(.+?)\@\>/gim,
    evaluate: /\<\@(.+?)\@\>/gim,
    escape: /\<\@\-(.+?)\@\>/gim
};

window.App = new Backbone.Marionette.Application();

App.PPS = 13

App.addRegions({
  tracks: '#mix .stage',
  effects: '.effect-panel .list',
  footer: '#footer',
  header: 'header',
  playhead: '#play-head'
});

App.on("start", function(options) {
  var ac = new webkitAudioContext();

  App.mix = new App.Models.Mix({context: ac}); //expose mix on the root of the app

  App.mix.on('regionLoaded', function(){
    var total = App.mix.get('regions')
      , loaded = App.mix.get('loaded');

    $('.loader .bar').css('width', loaded/total*100 + '%');
  });

  App.footer.show(new App.Views.FooterControls);
  App.playhead.show(new App.Views.PlayHead);

  App.mix.on('ready', function() {

    $('.loader').fadeOut();
    $('#play-head').fadeIn();

    App.tracks.show(new App.Views.TrackCollection({
      collection: App.mix.tracks
    }));

    App.header.show(new App.Views.HeaderView);
    App.effects.show(new App.Views.effectsLayoutView);
  });

  App.mix.parse(MIX);
});
