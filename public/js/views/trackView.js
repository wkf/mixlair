App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
  Views.TrackCollection = Backbone.Marionette.ItemView.extend({
    template: "#track-template",
    tagName: "li"
  });
});
