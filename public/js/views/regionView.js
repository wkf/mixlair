App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
  Views.RegionView = Backbone.Marionette.ItemView.extend({
    template: "#region-template",
    className: "region",

    events: {
      "drag": 'moveTrack',
      "draginit": 'dragInit',
      "dragstart": 'startMove',
    },

    initialize: function(){
      this.listenTo(this.model, 'stream', this.onstream);
      this.listenTo(this.model, 'recordStop', this.switchToWave);
      this.listenTo(mix, 'zoom', this.zoom);
    },

    dragInit: function() {
      this.trigger("dragInit");
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
      this.waveSvg = new waveSvg({
        buffer: this.model.get('activeBuffer'),
        maxHeight: 70,
        pixelsPerSecond: App.PPS,
        appendTo: this.el,
        max: 2,
        workerPath: "/js/peak-worker.js",
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

    startMove: function(e){
      this.prevX = e.clientX;
    },

    moveTrack: function(e){
      var el = $(e.currentTarget);
      var delta = e.clientX - this.prevX;
      var new_position = mix.snapTime(parseInt(el.css('left')) + delta);
      if (new_position < 0) new_position = 0
      el.css('left', new_position);
      this.prevX = e.clientX;
      this.model.set('start', new_position / App.PPS);
    },

    zoom: function(){
      var pps = App.PPS
        , start = this.model.get('start');
      if ( !this.waveSvg ) return;
      this.$el.css('left', start * pps);
      this.waveSvg.updatePixelsPerSecond(pps);
    }
  });
});
