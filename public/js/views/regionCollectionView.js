App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
  Views.RegionCollection = Backbone.Marionette.CollectionView.extend({
    tagName: "div",
    className: "regions",

    getItemView: function() {
      return App.Views.RegionView
    }
  });
});
