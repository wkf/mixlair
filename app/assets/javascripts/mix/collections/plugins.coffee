App.module "Collections", (Collections, App, Backbone, Marionette, $, _) ->
  class Collections.Plugins extends Backbone.Collection
    model: App.Models.Plugin
    params: {}

    connect: (ac) ->
      input   = @input
      output  = ac.createGain()
      last    = @input
      next    = null

      @forEach (plugin) -> plugin.createEffect(ac)
      @setAllParams()

      # connect all the plugins
      # todo this should be a method
      @forEach (plugin, i, plugins) ->
        if i == 0
          input.connect(plugin.get('plugin').input)
        if i == plugins.length - 1
          next = output
        else
          next = plugins[i + 1].get('plugin').input
        plugin.connect next

      @output = output
      @


    # set a single param on a plugin intance
    setParam: (name, param, val) ->
      plugin                = @findWhere(name: name)
      @params[name][param]  = val

      plugin.setParam param, val
      @

    # set a multiple params on a plugin intance
    setParams: (name, params) ->
      for key of params
        @setParam(name, params[key])
      @

    # set multiple params on multiple plugins
    setAllParams: ->
      plugins = @params
      for key of plugins
        plugin = @findWhere(name: key)
        plugin.setParams plugins[key]
      @

    # get a single param from a plugin instance
    getParam: (name, param) ->
      plugin  = @findWhere(name: name)
      value   = plugin.getParam(param)

      @params[name] = value
      plugin.getParam(param)

    # get all params from a plugin instance
    getParams: (name) ->
      plugin        = @findWhere(name: name)
      values        = plugin.getParams()
      @params[name] = values

      values

    # get all params for all plugin instances
    getAllParams: ->
      @params = result = {}

      @forEach (plugin) -> result[plugin.get('name')] = plugin.getParams()
      result
