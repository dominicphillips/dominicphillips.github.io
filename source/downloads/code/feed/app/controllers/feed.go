package controllers

import (
	"code.google.com/p/go.net/websocket"
	"feed/app/feed"
	"github.com/robfig/revel"
)

type Feed struct {
	*revel.Controller
}

func (c Feed) Connect(user string, ws *websocket.Conn) revel.Result {
	// Join the room.
	subscription := feed.Subscribe()
	defer subscription.Cancel()

	// Send down the archive.
	for _, event := range subscription.Archive {
		if websocket.JSON.Send(ws, &event) != nil {
			// They disconnected
			return nil
		}
	}

	newMessages := make(chan string)
	go func() {
		var msg string
		for {
			err := websocket.Message.Receive(ws, &msg)
			if err != nil {
				close(newMessages)
				return
			}
			newMessages <- msg
		}
	}()

	// Now listen for new events from either the websocket or the feed.
	for {
		select {
		case event := <-subscription.New:
			if websocket.JSON.Send(ws, &event) != nil {
				// They disconnected.
				return nil
			}
		case msg, ok := <-newMessages:
			// If the channel is closed, they disconnected.
			if !ok {
				return nil
			}

			// Otherwise, say something.
			feed.Say(user, msg)
		}
	}
	return nil
}
