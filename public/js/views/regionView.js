App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
  Views.RegionView = Backbone.Marionette.ItemView.extend({
    template: "#region-template",
    className: "region",
    initialize: function(){
      this.listenTo(this.model, 'stream', this.onstream);
      this.listenTo(this.model, 'recordStop', this.switchToWave);
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
      new waveSvg({
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
    }
  });
});
