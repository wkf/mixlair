App.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  Views.TrackItem = Backbone.Marionette.ItemView.extend({

    template: "#track-template",
    tagName: "li",
    className: "track",
    events: {
      "click": "trackClicked"
    },

    trackClicked: function() {
      this.trigger("trackClicked");
    }

  });

});
