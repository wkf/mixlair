module.exports = (app) ->
  class HomeController extends app.Controller
    index: (request, response) -> response.render 'home_views/index', title: 'Application'
    mix: (request, response) -> response.render 'home_views/mix'