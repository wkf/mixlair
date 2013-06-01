App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
  Views.TrackCollection = Backbone.Marionette.CollectionView.extend({
    tagName: "ul",
    initialize: function() {
      this.on('itemView:trackClicked', function() {
        console.log("d");
      });
    },
    getItemView: function() {
      return App.Views.TrackItem;
    }
  });
});
