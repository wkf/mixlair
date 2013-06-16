App.module "Util", (Util, App, Backbone, Marionette, $, _) ->

  # calculate peaks as dBFS (-192 to 0)
  class Util.Meter
    constructor: (ac) ->
      @ac     = ac
      @input  = ac.createScriptProcessor(512, 1, 1)
      @input.connect ac.destination
      @input.onaudioprocess = this.getdBFS.bind(this)
      @callbacks = []

    # calculate dBFS (-192 to 0, where 0 is loudest)
    getdBFS: (evt) ->
      input = evt.inputBuffer.getChannelData(0)
      len   = input.length
      total = i = 0

      while i < len
        total += (input[i] * input[i++])

      rms = Math.sqrt( total / len )
      db  = 20 * ( Math.log(rms) / Math.log(10) )

      # sanity check
      db = Math.max(-192, Math.min(db, 0));
      @callbacks.forEach (cb) -> cb(db)

      db

    # register callbacks that get passed a dBFS value
    # when onaudioprocess fires
    ondBFS: (callback) ->
      @callbacks.push callback
