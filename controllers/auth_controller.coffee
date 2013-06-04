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
      Mix.where('_id', request.user._id).findOne (error, mix) ->
        return response.send 'failed', 500 if error
        if mix
          response.redirect "/user/#{request.user._id}/mix/#{mix._id}"
        else
          Mix.create 'user': request.user._id, (error, mix) ->
            mix.populate ->
              response.redirect "/user/#{request.user._id}/mix/#{mix._id}"

    initializeTwitterAuth = ->
      TwitterStrategy = require('passport-twitter').Strategy

      passport.use(new TwitterStrategy({
        consumerKey: app.config.twitter.consumerId
        consumerSecret: app.config.twitter.consumerSecret
        callbackURL: app.config.twitter.callbackUrl
      }, (token, tokenSecret, profile, done) ->
        User.findOrCreateFromTwitterProfile profile, done
      ))

    initializeFacebookAuth = ->
      FacebookStrategy = require('passport-facebook').Strategy

      passport.use(new FacebookStrategy({
        clientID: app.config.facebook.appId
        clientSecret: app.config.facebook.appSecret
        callbackURL: app.config.facebook.callbackUrl
      }, (accessToken, refreshToken, profile, done) ->
        User.findOrCreateFromFacebookProfile profile, done
      ))

