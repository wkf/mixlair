App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
  Views.TrackCollection = Backbone.Marionette.CollectionView.extend({
    tagName: "ul",
    initialize: function() {
      this.on('itemview:trackClicked', this.setActiveTrack);

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

    getItemView: function() {
      return App.Views.TrackItem;
    }
  });
});
