App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
  Views.HeaderView = Backbone.Marionette.ItemView.extend({
    template: "#header-template",
    className: "header",
    ui: {
      timeline: ".timeline"
    },

    initialize: function() {
      $(window).on('scroll', _.bind(this.shiftTimeline, this));
      this.listenTo(mix, 'zoom', this.zoom);
    },

    events: {
      "click canvas": "clickJump"
    },

    clickJump: function(e) {
      // magic (timelineGrid horizontal padding)
      var margin = -20;
      mix.set('position', ( e.offsetX + margin ) / App.PPS);
    },

    onShow: function() {
      this.drawTimeline()
    },

    shiftTimeline: function() {
      this.timelineCanvas.css('left', -window.scrollX);
    },

    drawTimeline: function() {
      this.timelineInstance = new timelineGrid({
        pps: App.PPS,
        seconds: 100,
        fillStyle: "rgb(112, 118, 128)",
        height: 6,
        fontSize: 10,
        lineWidth: 1,
        stampEvery: 15,
        appendTo: this.ui.timeline[0]
      });

      this.timelineCanvas = this.ui.timeline.find('canvas');
      this.delegateEvents();
    },

    zoom: function(){
      var pps = App.PPS;
      this.timelineInstance.changePps(pps);
    }
  });
});
