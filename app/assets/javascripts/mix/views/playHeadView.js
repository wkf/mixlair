App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
  Views.PlayHead = Backbone.Marionette.ItemView.extend({
    template: "#playhead-template",
    className: 'playhead-wrap',

    ui: {
      'playhead': '.play-head'
    },

    initialize: function(){
      this.listenTo(App.mix, 'timeUpdate', this.move);
    },

    onShow: function(){
      var self = this, dragPos, left, max;
      this.ui.playhead.on('dragstart', function( e ){
        dragPos = e.pageX;
        left = parseInt(self.ui.playhead.css('left'), 10);
        max = App.mix.get('maxTime');
      }).on('dragend', function( e ){

      }).on('drag', function( e ){
        var delta = e.pageX - dragPos
          , newLeft = left + delta
          , pos = newLeft / App.PPS;
        if ( newLeft <= 0 ) return;
        if ( pos >= max ) return;
        App.mix.set('position', pos);
      });
    },
    move: function(){
      var pos = App.mix.get('position')
        , scrollX = window.scrollX
        , left = ( pos * App.PPS ) - scrollX;
      this.ui.playhead.css({left: left});
    }
  });
});
