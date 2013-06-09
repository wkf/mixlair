App.module('util', function(util, App, Backbone, Marionette, $, _) {
  util.keyBoardDown = {}

  util.keyBoard = (function() {
    App.on("start", setKeyBindings);

    function setKeyBindings() {

      $(window).on("keyup", function(e) {
        if ( App.blockKeyEvents ) return;

        if (util.keyBoardDown.shift && e.keyCode == 16) {
          util.keyBoardDown.shift = false;
        }
      });

      $(window).on("keydown", function(e) {
        if ( App.blockKeyEvents ) return;

        util.keyBoardDown.shift = event.shiftKey;

        switch (e.keyCode) {
          case 8: //delete key
            if (e.metaKey) {
              App.vent.trigger("keydown:delete");
            }
            e.preventDefault();
            return false;
          break;

          case 32: //space bar
            App.vent.trigger("keydown:space");
            return false
          break;

          case 87: //w
            App.vent.trigger("keydown:w");
          break;

          case 13: //enter
            App.vent.trigger("keydown:enter");
          break;

          case 82: //r
            if (!e.metaKey) {
              App.vent.trigger("keydown:r");
            }
          break;

          case 37: //left arrow
            App.vent.trigger("keydown:left-arrow");
            e.preventDefault();
            return false;
          break;

          case 39: //right arrow
            App.vent.trigger("keydown:right-arrow");
            e.preventDefault();
            return false;
          break;
        }
      });
    }
  })();
});
