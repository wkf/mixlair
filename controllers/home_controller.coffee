module.exports = (app) ->
  class HomeController extends app.Controller
    index: (request, response) -> response.redirect '/mix'
    mix: (request, response) -> response.render 'mix/mix', mix: require('../public/mix.json'), view_name: "mix"
