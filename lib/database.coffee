module.exports = (app) ->
  class Database
    $     = require('when')
    defer = require('deferrable')($)
    mongo = require('mongodb')

    constructor: ->
      @name = app.config.database?.name
      @port = app.config.database?.port or 27017
      @host = app.config.database?.host or 'localhost'

      @collections = {}

    # m = require('mongodb')
    # m.Db('mixlair_development', m.Server('localhost', 27017)).open (e, db) => @db = db
    # @db.collection 'users', (e, c) => @c = c
    # @c.save { id: 13501222, provider: 'twitter' }, (e, r) => @r = r

    open: (options = {}) ->
      @server    = mongo.Server(
        options.host or @host, options.port or @port)
      @connector = mongo.Db(options.name or @name, @server)

      @connector.defer('open').then (database) =>
        @store = @database = database
        @

    find: (collection, query, fields, options) ->
      @openCollection(collection).then (c) ->
        c.defer('find', query, fields)

    findOne: (collection, query, fields, options) ->

    findOrCreate: (collection, query, options) ->
      @openCollection(collection).then (c) ->
        c.defer('save', query, options)

    openCollection: (collection) ->
      $(@collections[collection] or @database.defer('collection', collection))
      .then (c) =>
        @collections[collection] = c
