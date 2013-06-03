App.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  Views.effectsLayoutView = Backbone.Marionette.Layout.extend({

    template: '#effects-layout-template',
    regions: { content: '.list' },

    initialize: function(options){
      this.track = options.track;
    },

    onRender: function(){
      var effectsCollectionView = new App.Views.effectsCollectionView({
        collection: new Backbone.Collection(App.util.fx)
      });
      this.content.show(effectsCollectionView);
      effectsCollectionView.on('effectPicked', _.bind(this.displayPanel, this));

      this.$el.find('.close').on('click', function(){
        $(this).closest('.effect-panel').slideUp();
        $('.fx').removeClass('active')
      });
    },

    displayPanel: function(effect){
      effect = _.findWhere(App.util.fx, { name: effect });

      var effectViews = [];
      for (var key in effect.params){
        effectViews.push({
          name: effect.name,
          param: key,
          value: effect.params[key].value,
          track: this.track,
          range: effect.params[key].range
        });
      }

      var effectDetailsCollectionView = new App.Views.effectDetailsCollectionView({
        collection: new Backbone.Collection(effectViews)
      });

      this.content.show(effectDetailsCollectionView);
    }

  });

});