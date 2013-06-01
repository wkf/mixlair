module.exports = (app) ->
  class TrackRouter extends app.Router
    Track = new app.Controllers.Track(app)

    @get '/track/:id', @routeTo(Track, 'download')
    @put '/track/:id', @routeTo(Track, 'upload')