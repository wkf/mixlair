module.exports = (app) ->
  class AudioController extends app.Controller
    fs   = require('fs')
    path = require('path')

    create: (request, response) ->
      file = expandPath(request.params.file)

      fs.exists file, (exists) ->
        if exists
          response.send 'Already Exists', 404
        else
          request.pipe(fs.createWriteStream(file))
          request.on 'end', ->
            response.send 'Okay', 200

    upload: (request, response) ->
      file = expandPath(request.params.file)

      fs.exists file, (exists) ->
        if exists
          request.pipe(fs.createWriteStream(file, flags: 'a'))
          request.on 'end', ->
            response.send 'Okay', 200
        else
          response.send 'Not Found', 404

    expandPath = (file) ->
      path.normalize "#{__dirname}/../public/audio/#{file}"