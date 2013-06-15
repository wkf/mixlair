App.module "Collections", (Collections, App, Backbone, Marionette, $, _) ->
  class Collections.Tracks extends Backbone.Collection
    model: App.Models.Track

    # begin playback of all tracks
    play: -> @forEach (track) -> track.play()

    # pause all tracks
    pause: -> @forEach (track) -> track.pause()

    # offset (in seconds) of the last playable audio, in relation
    # to mix position 0
    maxTime: ->
      Math.max.apply(Math, @map( (track) -> track.maxTime()))

    connectAll: ->
      @forEach  (track) ->
        track.set('output', track.get('mix').get('input'))
        track.connect()

    toJSON: ->
      result = []
      @forEach (track) ->
        result.push track.toJSON()
      result
