module.exports = (app) ->
  class MixRouter extends app.Router
    MixController    = new app.Controllers.Mix()

    @get '/user/:user/mixes', @routeTo(MixController, 'listMixes')
    @get '/user/:user/mix/:mix', @routeTo(MixController, 'showMix')
    @put '/user/:user/mix/:mix', @routeTo(MixController, 'updateMix')
    @post '/user/:user/mix', @routeTo(MixController, 'createMix')
    @delete '/user/:user/mix/:mix', @routeTo(MixController, 'deleteMix')

    @put '/user/:user/mix/:mix/track/:track', @routeTo(MixController, 'updateTrack')
    @post '/user/:user/mix/:mix/track', @routeTo(MixController, 'createTrack')
    @delete '/user/:user/mix/:mix/track/:track', @routeTo(MixController, 'deleteTrack')

    @put '/user/:user/mix/:mix/track/:track/region/:region', @routeTo(MixController, 'updateRegion')
    @post '/user/:user/mix/:mix/track/:track/region', @routeTo(MixController, 'createRegion')
    @delete '/user/:user/mix/:mix/track/:track/region/:region', @routeTo(MixController, 'deleteRegion')