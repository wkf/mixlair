$      = require('when')
{exec} = require('child_process')

run = (command) ->
  deferred = $.defer()
  exec command, (error, stdout, stderr) ->
    console.log stdout
    console.log stderr
    deferred.resolve(stdout, stderr)
  deferred.promise

start = ->
  run('NODE_ENV=production forever start -c coffee app.coffee')

stop = ->
  run('forever stopall')

restart = (callback) ->
  stop().then(start)

deploy = (branch) ->
  branch = branch or 'production'

  run('git fetch')
  .then ->
    run("git checkout #{branch}")
  .then ->
    run("git reset --hard origin/#{branch}")
  .then restart

task 'start', -> start()
task 'stop', -> stop()
task 'restart', -> restart()
task 'deploy', (options) -> deploy(options.arguments[0])