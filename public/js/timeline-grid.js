(function() {
  this.timelineGrid = (function() {
    function timelineGrid(args) {
      this.options = args;
      if (this.options.seconds == null) {
        throw "you must pass seconds";
      }
      if (this.options.pps == null) {
        throw "you must pass pps";
      }
      this.retina = window.devicePixelRatio || 1;
      this.options.horzPadding = 20 * this.retina;
      this.options.vertPadding = 20 * this.retina;
      this.options.fontSize = this.options.fontSize * this.retina || 15 * this.retina;
      this.options.font = this.options.font || "Helvetica";
      this.options.appendTo = this.options.appendTo || document.body;
      this.options.pps = this.options.pps * this.retina;
      this.options.stampEvery = this.options.stampEvery || 1;
      this.options.lineWidth = this.options.lineWidth * this.retina || 4 * this.retina;
      this.options.fontStyle = "" + this.options.fontSize + "px " + this.options.font;
      this.options.fillStyle = this.options.fillStyle || "black";
      this.options.fontFillStyle = this.options.fontFillStyle || this.options.fillStyle;
      this.options.height = (this.options.height * this.retina || 50 * this.retina) + this.options.vertPadding;
      this.options.width = this.options.seconds * this.options.pps + this.options.horzPadding;
      this.canvas = document.createElement('canvas');
      this.canvas.setAttribute('width', this.options.width);
      this.canvas.setAttribute('height', this.options.height);
      this.canvas.style.width = "" + (this.options.width / this.retina) + "px";
      this.canvas.style.height = "" + (this.options.height / this.retina) + "px";
      this.ctx = this.canvas.getContext('2d');
      this.ctx.fillStyle = this.options.fillStyle;
      this.options.appendTo.appendChild(this.canvas);
      this.draw();
    }

    timelineGrid.prototype.formatTime = function(second) {
      var min, oneM, seconds, tenM;

      min = ~~(second / 60);
      tenM = ~~(min / 10);
      oneM = ~~(min / 10 % 1 * 10);
      seconds = ("" + (second % 60)).length === 1 ? "0" + second % 60 : second % 60;
      return "" + tenM + oneM + ":" + seconds;
    };

    timelineGrid.prototype.changeDuration = function(duration) {
      this.options.seconds = duration;
      this.ctx.clearRect(0, 0, this.options.width, this.options.height);
      this.options.width = this.options.seconds * this.options.pps + this.options.horzPadding;
      this.canvas.setAttribute('width', this.options.width);
      this.canvas.style.width = "" + (this.options.width / this.retina) + "px";
      this.ctx = this.canvas.getContext('2d');
      this.ctx.fillStyle = this.options.fillStyle;
      return this.draw();
    };

    timelineGrid.prototype.changePps = function(pps) {
      this.options.pps = pps;
      return this.changeDuration(this.options.seconds);
    };

    timelineGrid.prototype.draw = function() {
      var h, i, metrics, o, timeStamp, x, y, _i, _ref;

      o = this.options;
      this.ctx.font = o.fontStyle;
      for (i = _i = 0, _ref = o.seconds; 0.5 > 0 ? _i < _ref : _i > _ref; i = _i += 0.5) {
        h = i % 1 ? (o.height - o.vertPadding) / 2 : o.height - o.vertPadding;
        x = i * o.pps + o.lineWidth / 2 + o.horzPadding;
        y = o.height - h + o.horzPadding;
        if (!(i % 1)) {
          timeStamp = this.formatTime(i + 1);
          metrics = this.ctx.measureText(timeStamp);
          if (o.fillStyle !== o.fontFillStyle) {
            this.ctx.fillStyle = o.fontFillStyle;
          }
          if (!(!i || (i + 1) % o.stampEvery)) {
            this.ctx.fillText(this.formatTime(i + 1), x - metrics.width / 2 + o.lineWidth / 2, this.options.vertPadding / 2);
          }
        }
        if (o.fillStyle !== o.fontFillStyle) {
          this.ctx.fillStyle = o.fillStyle;
        }
        this.ctx.rect(x, o.height - h, o.lineWidth, h);
      }
      return this.ctx.fill();
    };

    return timelineGrid;

  })();

}).call(this);
