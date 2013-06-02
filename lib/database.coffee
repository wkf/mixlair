module.exports = (app) ->
  $        = require('when')
  mongoose = require('mongoose')

  class Database
    constructor: ->
      @name = app?.config?.database?.name or 'test'
      @port = app?.config?.database?.port or 27017
      @host = app?.config?.database?.host or 'localhost'

    open: (options = {}) ->
      deferred = $.defer()
      mongoose.connect("mongodb://#{@host}:#{@port}/#{@name}")
      mongoose.connection.once 'open', ->
        deferred.resolve()
      deferred.promise