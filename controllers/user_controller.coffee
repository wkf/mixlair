module.exports = (app) ->
  class UserController extends app.Controller

    show: (request, response) ->
      console.log request.params.id
      response.render 'user_views/index'
