App.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  Views.effectsCollectionView = Backbone.Marionette.CollectionView.extend({
    tagName: 'ul',
    getItemView: function(){ return App.Views.effectView }
  });

});