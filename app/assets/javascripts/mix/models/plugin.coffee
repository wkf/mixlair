App.module "Models", (Models, App, Backbone, Marionette, $, _) ->
  class Models.Plugin extends Backbone.Model
    defaults:
      params: {}
      plugin: {}

    createEffect: (ac) ->
      tuna    = new Tuna(ac)
      type    = @get('type')
      params  = @get('params')
      plugin  = new tuna[type](params)
      output  = @get('output')

      @set
        tuna: tuna
        plugin: plugin

      @setParams()
      @

    connect: (node) ->
      plugin = @get('plugin')
      plugin.connect(node)

    # set an individual effect param
    setParam: (param, val) ->
      @get('plugin')[param] = val
      @get('params')[param] = val ;
      @

    # set multiple params
    setParams: (params) ->
      for key of params
        @setParam(key, params[key])
      @

    # get the value of a single param
    getParam: (param) ->
      params  = @get('params')
      val     = params[param]

    # get ALL param values
    getParams: ->
      params = @get('params')
      result = {}

      for key of params
        result[key] = params[key]
      result
