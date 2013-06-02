App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
  Views.TrackItem = Backbone.Marionette.Layout.extend({
    template: "#track-template",
    tagName: "li",
    className: "track",
    ui: {
      gain: '.gain-control',
      gain_alt: '.alt'
    },
    events: {
      "click": "trackClicked",
      "click .track-buttons > div": "toggleButton"
    },

    regions: {
      'regions': ".waveform"
    },

    initialize: function(){
      this.listenTo(this.model, 'meter', this.meter);
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

    meter: function(){
      var db = mix.get('dBFS')
        , percentage = 100 + (db * 1.92);
      this.ui.gain_alt.css({ width: percentage + "%" });
    },

    activateGainSlider: function(){
      var self = this;
      this.ui.gain.slider({
        value: self.model.get('volume') * 100,
        slide: function(e, ui){
          self.model.set('volume', ui.value / 100);
        }
      });
    },

    toggleButton: function(e){
      $(e.currentTarget).toggleClass('active')
    }

  });
});
