module.exports = (app) ->
  class UserController extends app.Controller
    User = app.Models.User

    show: (request, response) ->
      User.findOne _id: request.params.user, (error, user) ->
        if error
          response.write 'failed', 404
        else
          response.render 'user_views/show'

    update: (request, response) ->
      User.findOneAndUpdate _id: request.params.user, request.params, (error, user) ->
        if error
          response.write 'failed', 404
        else
          response.write 'updated'

    delete: (request, response) ->
      User.findOneAndRemove _id: request.params.user, (error) ->
        if error
          response.write 'failed', 404
        else
          response.write 'deleted'