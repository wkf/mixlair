module.exports = (app) ->
  console.log 'Initializing Routers...'

  app.Router = class Router
    @get: (args...) -> app.server.route.get(args...)
    @put: (args...) -> app.server.route.put(args...)
    @post: (args...) -> app.server.route.post(args...)
    @delete: (args...) -> app.server.route.delete(args...)
    @head: (args...) -> app.server.route.head(args...)
    @patch: (args...) -> app.server.route.patch(args...)
    @socket: (handler) -> app.server._socket = handler

    @routeTo: (controller, action) -> controller[action].bind(controller)

  app.Routers.Home   = require('./home_router.coffee')(app)
  app.Routers.Auth   = require('./auth_router.coffee')(app)

  app