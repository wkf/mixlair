module.exports = (app) ->
  class UserRouter extends app.Router
    UserController   = new app.Controllers.User()

    # implement so that subclasses have this prepended to their paths
    # @resource '/user/:user'

    @get '/user/:user', @routeTo(UserController, 'show')
    @put '/user/:user', @routeTo(UserController, 'update')
    @delete '/user/:user', @routeTo(UserController, 'delete')