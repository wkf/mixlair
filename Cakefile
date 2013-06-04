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
  branch = branch or 'master'

  run('git fetch')
  .then ->
    run('git rebase origin/`git rev-parse --abbrev-ref HEAD`')
  .then ->
    run("git checkout #{branch}")
  .then restart

task 'start', -> start()
task 'stop', -> stop()
task 'restart', -> restart()
task 'deploy', (branch) -> deploy(branch)
