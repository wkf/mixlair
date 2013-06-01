App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
  Views.TrackCollection = Backbone.Marionette.CollectionView.extend({
    tagName: "ul",

    getItemView: function() {
      return App.Views.TrackItem;
    }
  });
});
