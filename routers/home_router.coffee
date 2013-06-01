module.exports = (app) ->
  class HomeRouter extends app.Router
    @get '/', @routeTo(new app.Controllers.Home(app), 'index')
    @get '/mix', @routeTo(new app.Controllers.Home(app), 'mix')
