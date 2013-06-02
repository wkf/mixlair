App.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  Views.effectView = Backbone.Marionette.ItemView.extend({
    template: '#effect-template',
    tagName: 'li'
  });

});