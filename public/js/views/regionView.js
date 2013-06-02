App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
  Views.RegionView = Backbone.Marionette.ItemView.extend({
    template: "#region-template",
    className: "region",
    onShow: function() {
      var _s = this.model.get("start")
      this.$el.css('left', _s * App.PPS);
      this.generateSvg();
    },

    generateSvg: function() {
      new waveSvg({
        buffer: this.model.get('activeBuffer'),
        maxHeight: 70,
        pixelsPerSecond: App.PPS,
        appendTo: this.el,
        max: 2,
        workerPath: "/js/peak-worker.js",
        downSample: 16
      });
    }
  });
});
