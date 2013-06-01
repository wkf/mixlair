module.exports = (app) ->
  class UserRouter extends app.Router
    @get '/user/:id', @routeTo(new app.Controllers.User(app), 'show')
    # @get '/user/:id/mix/:id', @routeTo(new app.Controllers.Mix(app), 'show')
