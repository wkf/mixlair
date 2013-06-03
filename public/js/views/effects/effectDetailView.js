App.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  Views.effectDetailView = Backbone.Marionette.ItemView.extend({
    template: '#effect-details-template',

    tagName: 'li',

    ui: {
      "slider": ".slider"
    },

    onRender: function(){
      var self = this
        , name = this.model.get('name')
        , param = this.model.get('param')
        , track = this.model.get('track').model
        , min = this.model.get('range')[0]
        , max = this.model.get('range')[1]
        , val = track.getPluginParam(name, param);
      val = this.scale(val, min, max, 0, 100);
      this.ui.slider.slider({
        value: val,
        slide: _.bind(self.paramChange, this)
      });
      this.ui.slider.find('.alt').css('width', val + '%')
    },

    paramChange: function(e, ui) {
      var name = this.model.get('name')
        , param = this.model.get('param')
        , track = this.model.get('track').model
        , min = this.model.get('range')[0]
        , max = this.model.get('range')[1]
        , val = this.scale(ui.value, 0, 100, min, max);
      this.ui.slider.find('.alt').css('width', ui.value + '%')
      track.setPluginParam(name, param, val);
    },

    scale: function( val, f0, f1, t0, t1 ){
      return (val - f0) * (t1 - t0) / (f1 - f0) + t0;
    }

  });
});
