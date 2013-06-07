App.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  Views.effectDetailsCollectionView = Backbone.Marionette.CollectionView.extend({
    tagName: 'ul',
    getItemView: function(){ return App.Views.effectDetailView }
  });

});
