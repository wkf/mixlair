App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
  Views.RegionView = Backbone.Marionette.ItemView.extend({
    template: "#region-template",
    className: "region",

    events: {
      "drag": 'dragRegion',
      "draginit": 'dragInit',
      "dragstart": 'startMove',
      "dblclick": 'deFocus'
    },

    initialize: function() {
      this.listenTo(this.model, 'stream', this.onstream);
      this.listenTo(this.model, 'recordStop', this.switchToWave);
      this.listenTo(this.model, 'change:activeBuffer', this.generateWaveSvg);
      this.listenTo(this.model, 'resize', this.resize);
      this.listenTo(App.mix, 'zoom', this.zoom);
      this.listenTo(App.vent, 'keydown:delete', this.deleteRegion);
    },

    deFocus: function() {
      this.model.unset('selected');
      this.$el.removeClass('selected');
    },

    deleteRegion: function() {
      if (this.model.get('selected')) {
        this.model.destroy();
      }
    },

    clearPrevLeft: function() {
      delete this.prevLeft;
    },

    dragInit: function() {
      if (!this.model.get('selected')) { //if already active no need to rethow
        this.model.set('selected', 'selected');
        this.$el.addClass('selected');
        this.trigger("dragInit", this);
      }
    },

    onShow: function() {
      var _s = this.model.get("start")
      this.$el.css('left', _s * App.PPS);
      if ( !this.model.get('recording') ){
        this.generateWaveSvg();
      } else {
        this.generateStreamSvg();
      }
    },

    generateWaveSvg: function() {
      if ( !this.model.get('activeBuffer') ) return;
      this.waveSvg = new waveSvg({
        buffer: this.model.get('activeBuffer'),
        maxHeight: 70,
        pixelsPerSecond: App.PPS,
        appendTo: this.el,
        max: 2,
        workerPath: "/assets/vendor/peak-worker.js",
        downSample: 16
      });
    },

    generateStreamSvg: function() {
      this.streamSvg = new streamSvg({
        maxHeight: 70,
        pixelsPerSecond: App.PPS,
        appendTo: this.el,
        max: 2
      });
    },

    onstream: function( buffer ){
      if ( !this.streamSvg ) return;
      this.streamSvg.onstream(buffer);
    },

    switchToWave: function(){
      if ( !this.streamSvg ) return;
      this.streamSvg.svg.parentElement.removeChild(this.streamSvg.svg);
      this.generateWaveSvg();
      this.streamSvg = null;
    },

    startMove: function(e) {
      this.prevX = e.pageX;
      this.prevLeft = parseInt(this.$el.css('left'), 10);
      this.prevStart = this.model.get('start');
      this.prevSnap = App.mix.snapTime(this.prevStart);
      this.snapDelta = this.prevSnap - this.prevStart;
    },

    dragRegion: function(e){
      var delta = e.pageX - this.prevX;
      this.trigger("dragRegion", {delta: delta});
    },

    canShiftBy: function(amount) {
      this.prevLeft     = this.prevLeft || parseInt(this.$el.css('left'), 10);
      var new_position  = App.mix.snapTime((this.prevLeft + amount) / App.PPS);

      return new_position > 0;
    },

    shiftRegionByAmount: function(amount) {
      this.prevLeft = this.prevLeft || parseInt(this.$el.css('left'), 10);

      var new_position = App.mix.snapTime((this.prevLeft + amount) / App.PPS);
      if (new_position < 0) new_position = 0
      this.$el.css('left', new_position * App.PPS);
      this.model.set('start', new_position + this.snapDelta);
    },

    zoom: function(){
      var pps = App.PPS
        , start = this.model.get('start');
      if ( !this.waveSvg ) return;
      this.$el.css('left', start * pps);
      this.waveSvg.updatePixelsPerSecond(pps);
    },

    resize: function(){
     var pps = App.PPS
       , start = this.model.get('start');
      if ( !this.waveSvg ) return;
      this.waveSvg.svg.parentElement.removeChild(this.waveSvg.svg);
      this.generateWaveSvg();
      this.$el.css('left', start * pps);
    }
  });
});
