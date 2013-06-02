module.exports = (app) ->
  console.log 'Initializing Models...'

  app.Models.User = require('./user_model.coffee')(app)
  app.Models.Mix  = require('./mix_model.coffee')(app)

  app