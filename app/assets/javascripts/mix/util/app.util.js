// generic utility functions
App.module('util', function(util, App, Backbone, Marionette, $, _) {


  // convert a value from one scale to another
  // e.g. App.util.scale(-96, -192, 0, 0, 100) to convert
  // -96 from dB (-192 - 0) to percentage (0 - 100)
  util.scale = function( val, f0, f1, t0, t1 ){
    return (val - f0) * (t1 - t0) / (f1 - f0) + t0;
  };

  // convert dBFS to a percentage
  util.dBToPercent = function( dB ){
    return util.scale(dB, -192, 0, 0, 100);
  };

  // convert percentage to dBFS
  util.percentTodB = function( percent ){
    return util.scale(percent, 0, 100, -192, 0);
  }; 

  // convert a time value (seconds) to pixels
  util.secondToPixels = function( seconds ){
    return seconds * App.PPS;
  };

  // convert a pixel value to time (seconds)
  util.pixelsToSeconds = function( pixels ){
    return pixels / App.PPS;
  };

  // convert samples to seconds
  util.samplesToSeconds = function( samples, sampleRate ){
    return samples / ( sampleRate || 44100 );
  };

  // convert seconds to samples
  util.secondsToSamples = function( time, sampleRate ){
    return time * ( sampleRate || 44100 );
  };

  // convert pixels to samples
  util.pixelsToSamples = function( pixels, sampleRate ){
    return util.secondsToSamples(util.pixelsToSeconds( pixels ), sampleRate);
  };

  // convert samples to pixels
  util.samplesToPixels = function( samples, sampleRate ){
    return util.secondsToPixels(util.samplesToSeoconds(samples), sampleRate);
  };

  // clone a Float32ArrayBuffer
  util.cloneFloat32Array = function( ab ){
    var i = 0
      , len = ab.length
      , f32 = new Float32Array(ab.length);
    for ( ; i < len; ++i ){
      f32[i] = ab[i];
    }
    return f32;
  };

  // create an AudioBuffer from an ArrayBuffer
  // requires one or more ArrayBuffers and an AudioContext
  util.createAudioBuffer = function(){
    var args = _.toArray(arguments)
      , ac = args.pop()
      , sr = ac.sampleRate
      , channels = args.length
      , getLength = function(ab){return ab.length}
      , len = Math.max.apply(Math, _.map(args, getLength))
      , buf = ac.createBuffer(channels, len, sr)
    while ( channels-- ){
      buf.getChannelData(channels).set(args[channels]);
    }
    return buf;
  };

  // clone an AudioBuffer instance
  // requires an AudioBuffer and an AudioContext
  // optionally accepts from and to (both integers) for slicing
  util.cloneAudioBuffer = function( ab, ac, from, to ){
    var channels = ab.numberOfChannels
      , sr = ac.sampleRate
      , start = from || 0
      , end = to || ab.length
      , len = end - start
      , buf = ac.createBuffer(channels, len, sr)
      , clone;
    while ( channels-- ){
      clone = ab.getChannelData(channels).subarray(from, to);
      buf.getChannelData(channels).set(clone);
    }
    return buf;
  };

  // create a new BufferSource from an AudioBuffer instance
  // requires an AudioBuffers and an AudioContext
  util.createBufferSource = function( ab, ac ){
    var clone = util.cloneAudioBuffer(ab, ac)
      , src = ac.createBufferSource();
    src.buffer = clone;
    return src;
  };

});
