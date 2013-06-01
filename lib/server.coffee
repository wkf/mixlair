module.exports = (app) ->
  class Server
    $          = require('when')
    defer      = require('deferrable')($)
    express    = require('express')
    roots      = require('roots-express')

    constructor: ->
      passport   = require('passport')
      assets     = require('connect-assets')
      MongoStore = require('connect-mongo')(express)

      @port          = app.config.port or 3000
      @viewPath      = expandPath(app.config.views or 'views')
      @staticPath    = expandPath(app.config.static or 'public')
      @viewEngine    = app.config.viewEngine or 'jade'
      @sessionSecret = app.config.sessionSecret or 's3cr3t'

      roots.add_compiler(assets)

      @route = @app = express()

      @app.configure =>
        @app.set('views', @viewPath)
        @app.set('view engine', @viewEngine)
        @app.use(assets())
        @app.use(express.static(@staticPath))
        @app.use(express.cookieParser())
        @app.use(express.bodyParser())
        @app.use(express.methodOverride())
        @app.use(express.session(
          store: new MongoStore
            db: app.config.database.name
            host: app.config.database.host
            port: app.config.database.port
          secret: @sessionSecret
        ))
        @app.use(passport.initialize())
        @app.use(passport.session())
        @app.use(@app.router)

    listen: ->
      @server = require('http').createServer(@app)

      roots.watch(@server)

      @server.defer('listen', @port).then =>
        console.log "   info  - http server started on #{@port}"
        @

    expandPath = (path) ->
      require('path').normalize(__dirname + '/../' + path)
