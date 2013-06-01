module.exports = (app) ->
  console.log 'Initializing Controllers...'

  app.Controller = class Controller
    constructor: ->

  app.Controllers.Home = require('./home_controller.coffee')(app)
  app.Controllers.Auth = require('./auth_controller.coffee')(app)

  app