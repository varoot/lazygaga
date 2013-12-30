if Meteor.isClient
	Template.intro.greeting = "Welcome!"

	Template.intro.events
		'click input' : ()->
			# template data, if any, is available in 'this'
			console?.log "You pressed the button"

if Meteor.isServer
	Meteor.startup ()->
		# code to run on server at startup