module.exports = (app) ->
  mongoose = require('mongoose')

  schema = new mongoose.Schema
    id: Number
    provider: String
    email: String
    username: String

  schema.static 'findOrCreate', (attributes, callback) ->
    @findOneAndUpdate(attributes, attributes, upsert: true, callback)

  schema.static 'findOrCreateFromTwitterProfile', (profile, callback) ->
    @findOrCreate {
      id: profile.id
      provider: profile.provider
      username: profile.username
    }, callback

  schema.static 'findOrCreateFromFacebookProfile', (profile, callback) ->
    @findOrCreate {
      id: profile.id
      provider: profile.provider
      username: profile.username
    }, callback

  mongoose.model 'User', schema

  # require('mongoose').connect('mongodb://localhost/mixlair_development')
  # User = require('./models/user_model.coffee')()