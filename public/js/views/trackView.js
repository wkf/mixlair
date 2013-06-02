App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
  Views.TrackItem = Backbone.Marionette.Layout.extend({
    template: "#track-template",
    tagName: "li",
    className: "track",
    ui: {
      gain: '.gain-control',
      gain_alt: '.alt',
      mute: '.btn.mute',
      solo: '.btn.solo'
    },
    events: {
      "click": "trackClicked",
      "click .track-buttons > div": "toggleButton",
      "click .track-buttons .fx": "toggleEffectsPanel",
      "click .btn.mute": "mute",
      "click .btn.solo": "solo",
    },

    regions: {
      'regions': ".waveform"
    },

    initialize: function(){
      this.listenTo(this.model, 'meter', this.meter);
      this.listenTo(this.model, 'mute', this.onmute);
      this.listenTo(this.model, 'unmute', this.onunmute);
      this.listenTo(this.model, 'solo', this.onsolo);
      this.listenTo(this.model, 'unsolo', this.onunsolo);
    },

    addTrackRegions: function() {
      var regions = new App.Views.RegionCollection({
        collection: this.model.regions
      });

      this.regions.show(regions);

      regions.on("dragInit", _.bind(this.trackClicked, this));
    },

    onShow: function() {
      this.addTrackRegions();
      return this;
    },

    trackClicked: function() {
      this.trigger("trackClicked");
    },

    onRender: function(){
      this.activateGainSlider();
    },

    meter: function(){
      var db = mix.get('dBFS')
        , percentage = 100 + (db * 1.92);
      this.ui.gain_alt.css({ width: percentage + "%" });
    },

    activateGainSlider: function(){
      var self = this;
      this.ui.gain.slider({
        value: self.model.get('volume') * 100,
        slide: function(e, ui){
          self.model.set('volume', ui.value / 100);
        }
      });
    },

    toggleButton: function(e){
      // $(e.currentTarget).toggleClass('active');
    },

    toggleEffectsPanel: function(){
      // this.trigger('effectsClicked');
      App.Views.effectView.show()
    },

    renderEffects: function(){
      console.log('rendering fx...')
    },

    mute: function(){
      var muted = !!this.model.get('muted');
      if ( !muted ){
        this.model.mute();
      } else {
        this.model.unmute();
      }
    },

    solo: function(){
      var soloed = !!this.model.get('soloed');
      if ( !soloed ){
        this.model.solo();
      } else {
        this.model.unsolo();
      }
    },

    onmute: function(){
      this.ui.mute.addClass('active');
    },

    onunmute: function(){
      this.ui.mute.removeClass('active');
    },

    onsolo: function(){
      this.ui.solo.addClass('active');
    },

    onunsolo: function(){
      this.ui.solo.removeClass('active');
    }

  });
});
