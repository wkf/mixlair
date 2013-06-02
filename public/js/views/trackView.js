App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
  Views.TrackItem = Backbone.Marionette.Layout.extend({
    template: "#track-template",
    tagName: "li",
    className: "track",

    events: {
      "click": "trackClicked"
    },

    regions: {
      'regions': ".waveform"
    },

    onShow: function() {
      this.regions.show(new App.Views.RegionCollection({
        collection: this.model.regions
      }));

      return this;
    },

    trackClicked: function() {
      this.trigger("trackClicked");
    }

  });
});
