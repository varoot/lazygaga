if Meteor.isClient
  Template.hello.greeting = ->
    "Welcome to Lazy GAGA."

  Template.hello.events =
    'click input' : (e)->
      # template data, if any, is available in 'this'
      e.preventDefault()
      alert "You pressed the button"

if Meteor.isServer
  Meteor.startup ->
    # code to run on server at startup