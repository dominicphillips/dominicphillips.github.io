---
layout: post
title: "Realtime feed with Go websockets and backbone"
date: 2013-08-09 22:03
comments: true
categories: go backbone websockets
---

Something, something. WIP.

	func (c *connection) writer() {
	    for message := range c.send {
	        err := websocket.Message.Send(c.ws, message)
	        if err != nil {
	            break
	        }
	    }
	    c.ws.Close()
	}

	func wsHandler(ws *websocket.Conn) {
	    c := &connection{send: make(chan string, 256), ws: ws}
	    h.register <- c
	    defer func() { h.unregister <- c }()
	    go c.writer()
	    c.reader()
	}
