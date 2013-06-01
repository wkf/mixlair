module.exports = (app) ->
  class AuthController extends app.Controller
    passport = require('passport')

    User     = app.Models.User

    constructor: ->
      super
      passport.serializeUser (user, done) -> done(null, user)
      passport.deserializeUser (obj, done) -> done(null, obj)
      initializeTwitterAuth()
      initializeFacebookAuth()

    twitterAuth: passport.authenticate('twitter')
    twitterCallback: passport.authenticate('twitter',
      successRedirect: '/'
      failureRedirect: '/login'
    )

    facebookAuth: passport.authenticate('facebook')
    facebookCallback: passport.authenticate('facebook',
      successRedirect: '/'
      failureRedirect: '/login'
    )

    initializeTwitterAuth = ->
      TwitterStrategy = require('passport-twitter').Strategy

      passport.use(new TwitterStrategy({
        consumerKey: app.config.twitter.consumerId
        consumerSecret: app.config.twitter.consumerSecret
        callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
      }, (token, tokenSecret, profile, done) ->
        done null, User.findOrCreateFromTwitterProfile(profile)
      ))

    initializeFacebookAuth = ->
      FacebookStrategy = require('passport-facebook').Strategy

      passport.use(new FacebookStrategy({
        clientID: app.config.facebook.appId
        clientSecret: app.config.facebook.appSecret
        callbackURL: "http://127.0.0.1:3000/auth/facebook/callback"
      }, (accessToken, refreshToken, profile, done) ->
        done null, User.findOrCreateFromFacebookProfile(profile)
      ))

