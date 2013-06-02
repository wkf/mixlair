module.exports = (app) ->
  class MixController extends app.Controller
    Mix = app.Models.Mix

    listMixes: (request, response) ->
      Mix.find user_id: request.params.user, (error, mixes) ->
        return response.send 'failed', 500 if error
        response.send mixes

    showMix: (request, response) ->
      Mix.findOne _id: request.params.mix, (error, mix) ->
        return response.send 'failed', 404 if error
        response.render 'mix_views/show', {mix}

    updateMix: (request, response) ->
      Mix.findOneAndUpdate _id: request.params.mix, request.params, (error, mix) ->
        return response.send 'failed', 500 if error
        response.send mix

    createMix: (request, response) ->
      Mix.create request.params, (error, mix) ->
        return response.send 'failed', 500 if error
        response.send mix

    deleteMix: (request, response) ->
      Mix.findOneAndRemove _id: request.params.mix, (error) ->
        return response.send 'failed', 500 if error
        response.send {}

    updateTrack: (request, response) ->
      Mix.findOne _id: request.params.mix, (error, mix) ->
        mix.updateTrack request.params, (error, track) ->
          return response.send 'failed', 500 if error
          response.send track

    createTrack: (request, response) ->
      Mix.findOne _id: request.params.mix, (error, mix) ->
        mix.createTrack request.params, (error, track) ->
          return response.send 'failed', 500 if error
          response.send track

    deleteTrack: (request, response) ->
      Mix.findOne _id: request.params.mix, (error, mix) ->
        mix.deleteTrack request.params, (error, track) ->
          return response.send 'failed', 500 if error
          response.send {}

    updateRegion: (request, response) ->
      Mix.findOne _id: request.params.mix, (error, mix) ->
        mix.updateRegion request.params, (error, region) ->
          return response.send 'failed', 500 if error
          response.send region

    createRegion: (request, response) ->
      Mix.findOne _id: request.params.mix, (error, mix) ->
        mix.createRegion request.params, (error, region) ->
          return response.send 'failed', 500 if error
          response.send region

    deleteRegion: (request, response) ->
      Mix.findOne _id: request.params.mix, (error, mix) ->
        mix.deleteRegion request.params, (error, region) ->
          return response.send 'failed', 500 if error
          response.send region
