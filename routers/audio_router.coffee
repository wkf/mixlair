module.exports = (app) ->
  class AudioRouter extends app.Router
    Audio = new app.Controllers.Audio(app)

    @put '/audio/:file', @routeTo(Audio, 'upload')
    @post '/audio/:file', @routeTo(Audio, 'create')
