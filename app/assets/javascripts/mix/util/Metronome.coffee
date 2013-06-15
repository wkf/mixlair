App.module "Util", (Util, App, Backbone, Marionette, $, _) ->

  class Util.Metronome
    constructor: (ac, bpm) ->
      @ac = ac
      @setBpm bpm
      @download()

    download: ->
      xhr   = new XMLHttpRequest()

      xhr.open 'GET', '/mix/sound/click-track.wav', true
      xhr.responseType = 'arraybuffer'
      xhr.addEventListener 'load', =>
        @ac.decodeAudioData xhr.response, (buffer) =>
          @createBuffer = () ->
            i   = 0
            sr  = @ac.sampleRate
            len = @getBeatLength() * sr
            f32 = new Float32Array(len)
            while (i < 1000 and i < len)
              f32[i] = buffer.getChannelData(0)[i++]

            f32
      # xhr.send()

    createBuffer: ->
      i   = 0
      sr  = @ac.sampleRate
      len = @getBeatLength() * sr
      f32 = new Float32Array(len)
      while i < 1000 and i < len
        f32[i++] = ( Math.random() * 2 ) - 1

      f32

    start: (offset) ->
      @stop()

      beatLength    = @getBeatLength()
      @src          = @ac.createBufferSource()
      @src.buffer   = @audioBuffer
      @src.loop     = true

      @src.connect @ac.destination
      start = if offset == 0 then 0 else beatLength - ( if offset then offset % beatLength else 0 )

      @src.start @ac.currentTime + start

    stop: ->
      @src and @src.stop(0)

    getBeatLength: ->
      60 / @bpm

    setBpm: (bpm) ->
      sr            = @ac.sampleRate
      @bpm          = bpm || 120
      @buffer       = @createBuffer()
      len           = @buffer.length
      @audioBuffer  = @ac.createBuffer(1, len, sr)

      @audioBuffer.getChannelData(0).set @buffer
