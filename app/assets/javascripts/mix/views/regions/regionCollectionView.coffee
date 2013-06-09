@App.module 'Views', (Views, App, Backbone, Marionette, $, _) ->
  class Views.RegionCollection extends Backbone.Marionette.CollectionView
    tagName: "div"
    className: "regions"

    initialize: ->
      @on "itemview:dragInit",(e) ->
        @trigger "dragInit"
        @setFocusedRegion e

      @on "itemview:dragRegion", (e, data) ->
        @trigger "dragRegion", data

    setFocusedRegion: (e) ->
      if !App.util.keyBoardDown.shift
        @children.each (view) ->
          if view != e
            view.deFocus()

    deFocus: ->
      @children.each (view) ->
        view.deFocus()

    getItemView: ->
      App.Views.RegionView
