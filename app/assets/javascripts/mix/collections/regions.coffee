App.module "Collections", (Collections, App, Backbone, Marionette, $, _) ->
  class Collections.Regions extends Backbone.Collection
    model: App.Models.Region

    # begin playback of all regions
    play: ->
      @forEach (region) ->
        region.play()

    # pause all regions
    pause: ->
      @forEach (region) ->
        region.pause()

    # offset (in seconds) of the last playable audio, in relation
    # to mix position 0
    maxTime: ->
      Math.max.apply(Math, @map((region) ->
        region.maxTime()
      ))

    toJSON: ->
      result = []
      @forEach (region) ->
        result.push region.toJSON()
      result
