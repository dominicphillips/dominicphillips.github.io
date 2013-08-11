---
layout: post
title: "Building a realtime feed"
date: 2013-08-09 22:03
comments: true
categories: go backbone websockets revel
---

This is part one of the real time feed series, <del>check out parts [2](http://) and [3](http://)</del> <i>not yet</i>

In this series of blog posts we are going to build a web socket based real time feed, using the amazing revel framework, backbone, and HTML5 websockets.

Revel is a "high-productivity web framework" written in the Go language that shows promising results in benchmarks and is also a joy to work with. It sports a huge collection of features such as sessions, hot code reload, job running and a [bunch of other shenanigans](http://robfig.github.io/revel/manual/index.html). Bascially all the stuff you don't want to write on your own every time.

Websockets are a way of bi-directional communication between client and server and are supported by all newer browsers. You can read the spec [here](http://tools.ietf.org/html/rfc6455).

### Getting Started

First things first. We are running Go 1.1.1, the revel framework is installed to our $GOPATH and we're able to call the revel command line tool from your shell. If that sounds like crazy talk to you can read up about installing Go, the $GOPATH/BIN environment variables and installing revel here:

- [Getting started with Go](http://golang.org/doc/install)
- [Revel Quickstart](http://robfig.github.io/revel/index.html#quickstart)

We start off by creating a new revel project. The first command will install a skeletton app into our $GOPATH/src. After that we may run the application. Revel will put a harness around our app that will rebuild and reload the app every time it detects a code change. This allows us to see changes immediately, which is super neat. Our app listens on :9000 per default, upon navigating to localhost:9000 we're greeted with a friendly "It works!". So far so good.
```
$ revel new feed
$ revel run feed
```

After that we fire up our favorite editor and get to work. As we're building a single page application, our backbone router will do most of the routing. By adding a new "catch-all" route to our conf/routes file we ensure that every request that is not beeing catched by previous routes, gets handed off to our Index route. We're also adding a route that accepts a Websocket connection at /feed/connect which will be handled by the Feed controller (later).

{% include_code Adding a wildcard to our routes feed/conf/routes %}

Revel has a built in static file server that will serve from /public. We add a vendor folder to the public folder and download our frontend dependencies and include them in our footer template. We are also going to add a template that holds our underscore templates.

- [jQuery](http://jquery.com)
- [Underscore](http://underscorejs.org)
- [Backbone](http://backbonejs.org)

{% include_code Including frontend dependencies feed/app/views/footer.html %}

### Wiring up the frontend

We continue in app.js. with some boilerplate code. We're good citizen and namespace our app under the FEED object, so we don't pollute the global namespace. We add a start method that we use to bootstrap our router and views and wrap it inside jQuery's document ready function. We've also added a global event bus <i>vent</i>, that we can later publish events to.

``` javascript Bootstraping our frontend

window.Feed = {

	start: function() {
		this.vent = _.clone(Backbone.Events)
		this.router = new this.Router
		Backbone.history.start({pushState: true})
	}

}

Feed.Router = Backbone.Router.extend({
	routes: {
		''		:    'index'
	},
	index: function() {
		alert('hooray!')
	}
})


$(function() {
	Feed.start()
})


```

In the next post we're going to open a web socket connection and wire it all up with the Feed controller. Thanks for reading, stay tuned.











