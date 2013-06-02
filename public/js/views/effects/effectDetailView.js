App.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  Views.effectDetailView = Backbone.Marionette.ItemView.extend({
    template: '#effect-details-template',

    tagName: 'li',

    events: {
      "drag .slider": "paramChange"
    },

    ui: {
      "slider": ".slider"
    },

    onRender: function(){
      var self = this;
      this.ui.slider.slider({ value: self.model.get('value') });
    },

    paramChange: function(e) {
      console.log(e); // drag event
      console.log(this.model.get('track')) // track to apply the effect to
    }
  });
});
