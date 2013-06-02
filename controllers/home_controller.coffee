module.exports = (app) ->
  class HomeController extends app.Controller
    index: (request, response) -> response.render 'home_views/index', title: 'Application', view_name: "index"
    mix: (request, response) -> response.render 'mix/mix', mix: require('../public/mix.json'), view_name: "mix"
