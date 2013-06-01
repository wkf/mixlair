App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
  Views.TrackCollection = Backbone.Marionette.CollectionView.extend({
    tagName: "ul",
    initialize: function() {
      this.on('itemview:trackClicked', this.setActiveTrack);
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
