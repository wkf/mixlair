App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
  Views.RegionCollection = Backbone.Marionette.CollectionView.extend({
    tagName: "div",
    className: "regions",

    initialize: function() {
      this.on("itemview:dragInit", function() {
        this.trigger("dragInit");
      });
    },

    getItemView: function() {
      return App.Views.RegionView
    }
  });
});
