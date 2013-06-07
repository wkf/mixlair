// util for drag and drop upload of wav and mp3 files
App.module('util', function(util, App, Backbone, Marionette, $, _) {

  var upload = util.upload = {

    // get things started
    init: function(){
      upload.$target = $('body');
      upload.setDragBindings();
    },

    // events we want to listen to
    events: 'dragenter dragleave dragover drop',

    // className we need to add/remove to/from $target
    dragClass: 'dragover',

    // bind drag events
    setDragBindings: function() {
      $(window).on(upload.events, upload.evtHandler);
    },

    // deal with drag and drop events
    evtHandler: function( ev ) {
      var origEvent = ev.originalEvent;
      switch( ev.type ){
        case 'dragenter':
          break;
        case 'dragover':
          upload.$target.addClass(upload.dragClass);
          break;
        case 'dragleave':
          upload.$target.removeClass(upload.dragClass);
          break
        case 'drop':
          upload.$target.removeClass(upload.dragClass);
          upload.drop(origEvent.dataTransfer.files);
          break;
      }
      ev.preventDefault();
      return false;
    },

    // respond to drop events
    // starts the chain reaction of reading, decoding, splitting
    // and finally creating new tracks
    drop: function( files ){
      _.each(upload.getValidFiles(files), function( file ){
        upload.readFile(file);
      });
    },

    // return the subest of valid files from a dataTransfer file list
    getValidFiles: function( files ){
      var regex = /[^\s]+(\.(wav|mp3))$/i
      return _.filter(files, function( file ){
          return file.name && regex.test(file.name);
      });
    },

    // read a file and pass in on to decoding
    readFile: function( file ){
      var reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.addEventListener('load', function( ev ){
        upload.decode(ev.target.result, file.name);
      }, false);
    },

    // decode audio data, then send it along to splitChannels
    decode: function( arrayBuffer, filename ){
      var ac = App.mix.get('context')
        // remove file extension
        , name = filename.replace(/\.(wav|mp3)/i, '');
      ac.decodeAudioData(arrayBuffer, function( buffer ){
        upload.splitChannels(buffer, name);
      });
    },

    // split an AudioBuffer into multiple channels (if necessary)
    // then send them on their way to get created into tracks
    splitChannels: function( audioBuffer, name ){
      var channels = audioBuffer.numberOfChannels
        , channelNames = ['_left', '_right']
        , arrayBuffer
        , trackname
        , i = 0
        , clone
        , name;
      while ( i < channels ){
        arrayBuffer = audioBuffer.getChannelData(i);
        clone = util.cloneFloat32Array(arrayBuffer);
        trackname = name;
        // if this is a stereo track, append a channel name
        if ( channels > 1 ) trackname += channelNames[i];
        upload.createTrack(clone, trackname);
        i++;
      }
    },

    // create a new track and add it to the mix
    createTrack: function( arrayBuffer, name ){
      var mix = App.mix
        , ac = mix.get('context')
        , audioBuffer = util.createAudioBuffer(arrayBuffer, ac)
        , track = new App.Models.Track({
            name: name,
            context: ac,
            output: mix.get('input'),
            collection: mix.tracks,
            mix: mix
          });
      track.regions.add({
        name: name,
        buffer: audioBuffer,
        activeBuffer: audioBuffer,
        output: track.get('input'),
        track: track,
        mix: App.mix
      });
      App.mix.tracks.add(track);
    }

  };

  App.on('start', upload.init);

});
