module.exports = (app) ->
  class AuthController extends app.Controller
    passport = require('passport')

    User     = app.Models.User
    Mix      = app.Models.Mix

    constructor: ->
      super
      passport.serializeUser (user, done) ->
        done(null, user._id)
      passport.deserializeUser (obj, done) ->
        User.findOne _id: obj, done

      initializeTwitterAuth()
      initializeFacebookAuth()

    twitterAuth: passport.authenticate('twitter')
    twitterCallback: passport.authenticate('twitter'
      failureRedirect: '/'
    )

    facebookAuth: passport.authenticate('facebook')
    facebookCallback: passport.authenticate('facebook',
      failureRedirect: '/'
    )

    successfulAuth: (request, response) ->
      Mix.findOrCreate user: request.user._id, (error, mix) ->
        return response.send 'failed', 500 if error
        mix.populate (error) ->
          return response.send 'failed', 500 if error
          response.redirect "/user/#{request.user._id}/mix/#{mix._id}"

    initializeTwitterAuth = ->
      TwitterStrategy = require('passport-twitter').Strategy

      passport.use(new TwitterStrategy({
        consumerKey: app.config.twitter.consumerId
        consumerSecret: app.config.twitter.consumerSecret
        callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
      }, (token, tokenSecret, profile, done) ->
        User.findOrCreateFromTwitterProfile profile, done
      ))

    initializeFacebookAuth = ->
      FacebookStrategy = require('passport-facebook').Strategy

      passport.use(new FacebookStrategy({
        clientID: app.config.facebook.appId
        clientSecret: app.config.facebook.appSecret
        callbackURL: "http://127.0.0.1:3000/auth/facebook/callback"
      }, (accessToken, refreshToken, profile, done) ->
        User.findOrCreateFromFacebookProfile profile, done
      ))

