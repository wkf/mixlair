App.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  Views.effectDetailView = Backbone.Marionette.ItemView.extend({
    template: '#effect-details-template',

    tagName: 'li',

    ui: {
      "slider": ".slider"
    },

    onRender: function(){
      var self = this;
      this.ui.slider.slider({
        value: self.model.get('value'),
        slide: _.bind(self.paramChange, this)
        // min: self.model.get('range')[0],
        // max: self.model.get('range')[1],
      });

      var val = self.model.get('value');
      if (val > 100) val = 100;

      this.ui.slider.find('.alt').css('width', val + '%')
    },

    paramChange: function(e, ui) {
      console.log(ui)
      this.ui.slider.find('.alt').css('width', ui.value + '%')
      console.log(this.model.get('name')) // name of the effect to apply
      console.log(this.model.get('track')) // track to apply the effect to
      console.log(ui.value); // drag event (value)
    }
  });
});
