module.exports = (app) ->
  mongoose = require('mongoose')
  uuid     = require('node-uuid')

  schema = new mongoose.Schema
    bpm: Number
    user: mongoose.Schema.ObjectId
    tracks: [
      name: String
      muted: Boolean
      _muted: Boolean
      soloed: Boolean
      volume: Number
      pluginParams:
        compressor:
          bypass: Number
          threshold: Number
          release: Number
          makeupGain: Number
          attack: Number
          ratio: Number
          knee: Number
          automakeup: Boolean
        chorus:
          bypass: Number
          feedback: Number
          delay: Number
          depth: Number
          rate: Number
        tremelo:
          bypass: Number
          intensity: Number
          stereoPhase: Number
          rate: Number
        delay:
          bypass: Number
          delayTime: Number
          feedback: Number
          cutoff: Number
          wetLevel: Number
          dryLevel: Number
        reverb:
          bypass: Number
          highCut: Number
          lowCut: Number
          dryLevel: Number
          wetLevel: Number
          impulse: String
      regions: [
        url: String
        start: Number
        startOffset: Number
        stopOffset: Number
        fadeIn: Number
        fadeOut: Number
      ]
    ]

  schema.static 'findOrCreate', (attributes, callback) ->
    @findOneAndUpdate(attributes, attributes, upsert: true, callback)

  schema.method 'populate', (callback) ->
    @createTrack {}, (error) =>
      @createTrack {}, (error) =>
        callback(error)

  schema.method 'createTrack', (params = {}, callback) ->
    @tracks.push
      name: params.name
      muted: params.muted
      _muted: params._muted
      soloed: params.soloed
      volume: params.volume
      pluginParams: params.pluginParams
      regions:[]
    @save (error, mix) ->
      callback(error, mix.tracks[-1..][0])

  schema.method 'updateTrack', (params, callback) ->
    track = @tracks[params.track]
    @tracks[params.track] =
        name: params.name or track.name
        muted: params.muted or track.muted
        _muted: params._muted or track._muted
        soloed: params.soloed or track.soled
        volume: params.volume or track.volume
        pluginParams: params.pluginParams or track.pluginParams
      @sa    name: String
      muted: Boolean
      _muted: Boolean
      soloed: Boolean
      volume: Number
      pluginParams:
        compressor:
          bypass: Number
          threshold: Number
          release: Number
          makeupGain: Number
          attack: Number
          ratio: Number
          knee: Number
          automakeup: Boolean
        chorus:
          bypass: Number
          feedback: Number
          delay: Number
          depth: Number
          rate: Number
        tremelo:
          bypass: Number
          intensity: Number
          stereoPhase: Number
          rate: Number
        delay:
          bypass: Number
          delayTime: Number
          feedback: Number
          cutoff: Number
          wetLevel: Number
          dryLevel: Number
        reverb:
          bypass: Number
          highCut: Number
          lowCut: Number
          dryLevel: Number
          wetLevel: Number
          impulse: String
      regions: [
        url: String
        start: Number
        startOffset: Number
        stopOffset: Number
        fadeIn: Number
        fadeOut: Number
      ]ve (error, mix) ->
      callback(error, mix.tracks[params.track])

  schema.method 'deleteTrack', (params, callback) ->
    @tracks[param.track] = {}
    @save (error, mix) ->
      callback(error, mix.tracks[params.track])

  schema.method 'createRegion', (params, callback) ->
    @tracks[params.track].regions.push
      url: "/audio/#{uuid.v4()}"
      start: params.start
      startOffset: params.startOffset
      stopOffset: params.stopOffset
      fadeIn: params.fadeIn
      fadeOut: params.fadeOut
    @save (error, mix) ->
      callback(error, mix.tracks[params.track].regions[-1..][0])

  schema.method 'updateRegion', (params, callback) ->
    region = @tracks[params.track].regions[params.region]
    @tracks[params.track].regions[params.region] =
      start: params.start or region.start
      startOffset: params.startOffset or region.startOffset
      stopOffset: params.stopOffset or region.stopOffset
      fadeIn: params.fadeIn or region.fadeIn
      fadeOut: params.fadeOut or region.fadeOut
    @save (error, mix) ->
      callback(error, mix.tracks[params.track].regions[params.region])

  schema.method 'deleteRegion', (params, callback) ->
    @tracks[params.track].regions[params.region] = {}
    @save (error, mix) ->
      callback(error, mix.tracks[params.track].regions[params.region])

  mongoose.model 'Mix', schema