# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/

//= require ./backbone_vendor/underscore
//= require ./backbone_vendor/backbone
//= require ./backbone_vendor/marionette.1.0.3
//= require_tree ./vendor
//= require ./mix/MIX
//= require ./mix/app
//= require_tree ./mix/models
//= require_tree ./mix/collections
//= require_tree ./mix/views
//= require_tree ./mix/util

$().ready () -> App.start()
