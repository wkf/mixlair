class App
  $     = require('when')
  defer = require('deferrable')($)

  constructor: ->
    @config      = require('./config.json')

    @Models      = require('./models')
    @Controllers = require('./controllers')
    @Routers     = require('./routers')

    @database    = new (require('./lib/database')(@))(@config.database)
    @server      = new (require('./lib/server')(@))(@config.server)

  run: ->
    console.log 'Started'

    $(@)
    .then(@Models)
    .then(@Controllers)
    .then(@Routers)
    .then(=>@database.open())
    .then(=>@server.listen())
    .then(receiveSignal)
    .then(appStopped, appCrashed)

  receiveSignal = ->
    deferred = $.defer()
    process.on 'SIGINT', deferred.resolve
    process.on 'SIGTERM', deferred.resolve
    deferred.promise

  appStopped = ->
    console.log 'Stopped'
    process.exit 0

  appCrashed = (error) ->
    console.log 'Crashed', error
    process.exit 1

(new App()).run()
