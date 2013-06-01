App.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  Views.TrackItem = Backbone.Marionette.ItemView.extend({

    template: "#track-template",
    tagName: "li",
    className: "track",
    events: {
      "click": "trackClicked"
    },

    trackClicked: function() {
      console.log(this);
      this.$el.addClass('active');
      this.trigger("trackClicked");
    }

  });

});
