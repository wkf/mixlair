App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
  Views.TrackItem = Backbone.Marionette.Layout.extend({
    template: "#track-template",
    tagName: "li",
    className: "track",
    ui: {
      gain: '.gain-control'
    },
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
    },

    onRender: function(){
      this.activateGainSlider();
    },

    activateGainSlider: function(){
      var self = this;
      this.ui.gain.slider({
        value: 90,
        slide: function(e, ui){
          $(ui.handle).prev('.alt').css({ width: ui.value + "%" })
        }
      });
    }

  });
});
