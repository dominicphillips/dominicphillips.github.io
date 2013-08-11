window.Feed = {

	start: function() {
		var _this = this
		this.vent = _.clone(Backbone.Events)
		this.router = new this.Router
		this.user = new this.User
		this.appView = new this.AppView

		Backbone.history.start({pushState: true})
	},
	connect: function() {
		var _this = this
		this.sock = new WebSocket('ws://localhost:9000/feed/connect?user=' + this.user.get('name'))
		this.sock.onmessage = function(e) {
			_this.vent.trigger('socket:message', JSON.parse(e.data))
		}
	}
}

Feed.AppView = Backbone.View.extend({

	el: '#app',

	show: function(view) {
		if (this.currenteView) this.currenteView.remove()
		this.currenteView = view
		this.$el.html(view.render().el)
	}
})


Feed.User = Backbone.Model.extend({
	defaults: {
		name: "Anonymous"
	}
})


Feed.FeedView = Backbone.View.extend({
	id : '#feed',

	initialize: function() {
		this.collection.on('add', this.add, this)
	},

	add: function(model) {
		var view = new Feed.FeedItemView({model : model})
		this.$el.prepend(view.render().el)
	}

})


Feed.FeedItem = Backbone.Model.extend({})

Feed.FeedCollection = Backbone.Collection.extend({
	model: Feed.FeedItem,

	initialize: function() {
		var _this = this
		Feed.vent.on('socket:message', function(data) {
			_this.add(data)
		})
	}

})

Feed.ItemView = Backbone.View.extend({
	render: function() {
		var ctx = this.model ? this.model.toJSON() : {}
		this.$el.html(this.template(ctx))
		return this
	}
})

Feed.FeedItemView = Feed.ItemView.extend({
	template: _.template($('#feed-item').html())
})

Feed.SettingsView = Feed.ItemView.extend({
	template: _.template($('#user-settings').html()),

	events: {
		'click button' : 'onClickButton'
	},

	onClickButton: function(e) {
		var name = this.$el.find('input').val()
		if (name <= 0) return
		this.model.set('name', name)
		Feed.router.navigate('/feed', true)

	}

})


Feed.Router = Backbone.Router.extend({
	routes: {
		''		 	: 'index',
		'feed' 		: 'feed'
	},

	feed: function() {
		var feed = new Feed.FeedCollection
		var feedView = new Feed.FeedView({collection: feed})
		Feed.appView.show(feedView)
		Feed.connect()
	},

	index: function() {
		var settingsView = new Feed.SettingsView({model: Feed.user})
		Feed.appView.show(settingsView)
	}
})



$(function() {
	Feed.start()

})



