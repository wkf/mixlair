App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
  Views.TrackCollection = Backbone.Marionette.CompositeView.extend({
    tagName: "ul",
    template: "#track-collection",

    events: {
      'click .track .add-track': 'addTrack',
      'mouseup': 'resetRegionOffsets'
    },

    firstRender: false,

    initialize: function() {
      var self = this;
      this.on('itemview:trackClicked', this.setActiveTrack);
      this.on('itemview:dragRegion', this.regionDragged);
      this.on('itemview:effectsClicked', this.activateEffectsPanel);
      this.on('render', function(){
        self.firstRender = true;
      });

      $(window).on('scroll', _.bind(this.scrollTracks, this));
    },

    resetRegionOffsets: function() {
      this.collectSelectedRegions().forEach(function(r) {
        r.clearPrevLeft();
      });
    },

    // gets all of the selected regions
    // returns an array of them
    collectSelectedRegions: function() {
      var activeRegions = [];
      this.children.each(function(track) {
        if (track.model.get('focused')) { //first short circut check to make sure the track is active
          track.regions.currentView.children.each(function(region) {
            if (region.model.get('selected')) {
              activeRegions.push(region);
            }
          });
        }
      });

      return activeRegions;
    },

    regionDragged: function(e, d) {
      var canShift = true;

      this.collectSelectedRegions().forEach(function(r) {
        if (!r.canShiftBy(d.delta)) {
          canShift = false;
        }
      });

      canShift && this.collectSelectedRegions().forEach(function(r) {
        r.shiftRegionByAmount(d.delta);
      });
    },

    scrollTracks: function(e) {
      $('.info').css('margin-top', $(window).scrollTop()*-1)
    },

    appendHtml: function(collectionView, itemView, index) {
      collectionView.$el.prepend(itemView.el);
    },

    setActiveTrack: function(t) {
      if (!App.util.keyBoardDown.shift) {
        this.children.each(function(view) {
          if (view != t) {
            view.deFocus();
          }
        });
      }
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
      App.mix.createTrack('Track');
    },

    onAfterItemAdded: function( itemView ){
      if ( !this.firstRender ) return;
      this.setActiveTrack(itemView);
      App.mix.activateTrack(itemView.model);
    }
  });
});
