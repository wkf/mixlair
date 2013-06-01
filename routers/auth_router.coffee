module.exports = (app) ->
  class AuthRouter extends app.Router
    Auth = new app.Controllers.Auth(app)

    @get '/auth/twitter', @routeTo(Auth, 'twitterAuth')
    @get '/auth/twitter/callback', @routeTo(Auth, 'twitterCallback')

    @get '/auth/facebook', @routeTo(Auth, 'facebookAuth')
    @get '/auth/facebook/callback', @routeTo(Auth, 'facebookCallback')