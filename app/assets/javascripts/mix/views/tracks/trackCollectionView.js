App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
  Views.TrackCollection = Backbone.Marionette.CompositeView.extend({
    tagName: "ul",
    template: "#track-collection",
    events: {
      'click .track .add-track': 'addTrack'
    },
    firstRender: false,
    initialize: function() {
      var self = this;
      this.on('itemview:trackClicked', this.setActiveTrack);
      this.on('itemview:effectsClicked', this.activateEffectsPanel);
      this.on('render', function(){
        self.firstRender = true;
      });
      $(window).on('scroll', _.bind(this.scrollTracks, this));
    },

    scrollTracks: function(e) {
      $('.info').css('margin-top', $(window).scrollTop()*-1)
    },

    appendHtml: function(collectionView, itemView, index) {
      collectionView.$el.prepend(itemView.el);
    },

    setActiveTrack: function(t) {
      this.children.each(function(view){
        view.$el.removeClass('active');
      });
      t.$el.addClass('active')
    },

    activateEffectsPanel: function(e){
      var current = e.$el.find('.fx');
      var panel = $('.effect-panel');
      var wasActive = current.hasClass('active');

      this.children.each(function(view){
        view.$el.find('.fx').removeClass('active')
      });

      if (wasActive){
        panel.slideUp();
      } else {
        current.addClass('active');
        panel.slideDown();
        e.renderEffects();
      }

    },

    getItemView: function() {
      return App.Views.TrackItem;
    },

    addTrack: function(){
      mix.createTrack('Track');
    },
    onAfterItemAdded: function( itemView ){
      if ( !this.firstRender ) return;
      this.setActiveTrack(itemView);
      mix.activateTrack(itemView.model);
    }
  });
});
