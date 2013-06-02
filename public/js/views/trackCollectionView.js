App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
  Views.TrackCollection = Backbone.Marionette.CollectionView.extend({
    tagName: "ul",
    initialize: function() {
      this.on('itemview:trackClicked', this.setActiveTrack);
      this.on('itemview:effectsClicked', this.activateEffectsPanel);
      $(window).on('scroll', _.bind(this.scrollTracks, this));
    },

    scrollTracks: function() {

    },

    setActiveTrack: function(t) {
      this.children.each(function(view){
        view.$el.removeClass('active');
      });
      t.$el.addClass('active')
    },

    activateEffectsPanel: function(e){
      var current = e.$el.find('.fx');
      var panel = $('.effect-panel');
      var wasActive = current.hasClass('active');

      this.children.each(function(view){
        view.$el.find('.fx').removeClass('active')
      });

      if (wasActive){
        panel.slideUp();
      } else {
        current.addClass('active');
        panel.slideDown();
        e.renderEffects();
      }

    },

    getItemView: function() {
      return App.Views.TrackItem;
    }
  });
});
