module.exports = (app) ->
  console.log 'Initializing Models...'

  app.Model = class Model
    @_ =
      collection: {}
      hooks: {}
      files: {}
      validators: {}
      defaults: {}

    database = app.database

    class TypeError extends Error
    class ValidationError extends Error

    parseObject = (model, schema, validators, path = '') ->
      _model = {}
      for name, _schema of schema
        _model[name] = switch getType(_schema)
          when 'string' then parseString(model[name], _schema, validators, path + name)
          when 'object' then parseObject(model[name], _schema, validators, path + name + '.')
          when 'array' then parseArray(model[name], _schema[0], validators, path + name + '.')
      _model

    parseArray = (model, schema, validators, path = '') ->
      switch getType(schema)
        when 'string' then parseString(_model, schema, validators, path) for _model in model
        when 'object' then parseObject(_model, schema, validators, path) for _model in model
        when 'array' then parseArray(_model, schema, validators, path) for _model in model

    parseString = (model, schema, validators, path = '') ->
      # console.log "#{path} #{model}:#{schema}"
      for validator in validators[path] or []
        throw new ValidationError("Invalid #{path} - #{model}") unless validator(model)

      switch schema
        when 'ObjectId' then castObjectId(model)
        when 'String' then castString(model)
        when 'Date' then castDate(model)
        when 'Binary' then castBinary(model)
        when 'Long' then castLong(model)
        when 'Double' then castDouble(model)
        when 'File' then castFile(model)

    castObjectId = (objectId) ->
      switch getType(objectId)
        when 'string' then database.ObjectID(objectId)
        when 'number' then database.ObjectID(objectId)
        else throw new TypeError("Unable to cast #{getType(objectId)} as objectid")

    castString = (string) ->
      return string if getType(string) is 'string'
      return string.toString() if string.toString
      throw new TypeError("Unable to cast #{getType(string)} as string")

    castDate = (date) ->
      switch getType(date)
        when 'object' then new Date(date)
        when 'number' then new Date(date)
        when 'string' then new Date(Date.parse date)
        else
          return database.Timestamp() if date is Date.now
          throw new TypeError("Unable to cast #{getType(date)} as date")

    castBinary = (binary) ->
      switch getType(binary)
        when 'string' then database.Binary(binary)
        when 'buffer' then database.Binary(binary)
        else throw new TypeError("Unable to cast #{getType(binary)} as binary")

    castLong = (long) ->
      return database.Long(long) if getType(long) is 'number'
      throw new TypeError("Unable to cast #{getType(long)} as long")

    castDouble = (double) ->
      return database.Double(double) if getType(double) is 'number'
      throw new TypeError("Unable to cast #{getType(double)} as double")

    castFile = (file) ->
      return file._id

    # castFile = (file) =>
    #   Object.defineProperty model, path.split('.')[-1..],
    #     get: =>
    #       @_.files[path] = @_.files[path] or new File(@._collection, file)

    getType = (object) ->
      switch typeof object
        when 'number' then 'number'
        when 'string' then 'string'
        when 'object'
          return 'array' if Array.isArray(object)
          return 'buffer' if Buffer.isBuffer(object)
          'object'

    @find: (query, fields, options) ->
      database.find(@_.collection, query, fields, options)

    @findOne: (query, fields, options) ->
      database.findOne(@_.collection, query, fields, options)

    @findOrCreate: (query, options) ->
      console.log 'findOrCreate', query
      database.findOrCreate(@_.collection, query, options).then (data) ->
        new @(data)

    @schema: (schema) -> @_.schema = schema

    @collection: (collection) -> @_.collection = collection

    @default: (selector, value) ->
      @_.defaults[selector] = @_.defaults[selector] or []
      @_.defaults[selector].push(value)

    @validate: (selector, hook) ->
      @_.validators[selector] = @_.validators[selector] or []
      @_.validators[selector].push(hook)

    @hook: (action, hook) ->
      @_.hooks[action] = @_.hooks[action] or []
      @_.hooks[action].push(hook)

    constructor: (attributes) ->

    save: ->
      defaults          = @_.defaults or []
      validators        = @_.validators or []
      before_save_hooks = @_.hooks['beforeSave'] or []
      after_save_hooks  = @_.hooks['afterSave'] or []

      hook(@) for hook in before_save_hooks

      toSave = parseObject(@, @_.schema, validators)

      hook(@) for hook in after_save_hooks

      toSave

  app.Models.User   = require('./user_model.coffee')(app)

  app