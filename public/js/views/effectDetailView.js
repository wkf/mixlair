App.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  Views.effectDetailView = Backbone.Marionette.ItemView.extend({
    template: '#effect-details-template',

    tagName: 'li',

    events: {
      "drag .slider": "paramChange"
    },

    initialize: function(){
      this.model && console.log(this.model.get('name'))
    },

    paramChange: function(e) {
      console.log(e)
    }
  });
});
