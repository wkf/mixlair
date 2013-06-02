App.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  Views.effectsCollectionView = Backbone.Marionette.CollectionView.extend({
    tagName: 'ul',
    initialize: function() {
      this.on("itemview:effectPicked", this.effectPicked)
    },

    effectPicked: function(t) {
      this.trigger("effectPicked", t.model.get("name"));
    },

    getItemView: function(){ return App.Views.effectView }
  });

});
