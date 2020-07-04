import React, { Component } from "react";

import messageSound from "../../../assets/audio/swiftly.mp3";
import Talk from "talkjs";

class TextChat extends Component {
  constructor(props) {
    super(props);

    this.inbox = undefined;
    this.state = {
      opened: false,
    };
  }

  // shouldComponentUpdate() {

  // }
  componentDidMount() {
    // Promise can be `then`ed multiple times

    const audio = new Audio(messageSound);

    Talk.ready
      .then(() => {
        const me = new Talk.User({
          id: this.props.id,
          name: this.props.name,
          role: "Student",
          // email: "george@looney.net",

          welcomeMessage: null,
        });

        if (!window.talkSession) {
          window.talkSession = new Talk.Session({
            appId: this.props.talkJSData.appId,
            me: me,
          });
        }

        const other = new Talk.User({
          id: this.props.talkJSData.id,
          name: this.props.talkJSData.name,
          role: "Recruiter",
          // email: "ronald@teflon.com",

          welcomeMessage: null,
        });

        // You control the ID of a conversation. oneOnOneId is a helper method that generates
        // a unique conversation ID for a given pair of users.
        const conversationId = Talk.oneOnOneId(me, other);

        const conversation = window.talkSession.getOrCreateConversation(
          conversationId
        );
        conversation.setParticipant(me);
        conversation.setParticipant(other);

        this.inbox = window.talkSession.createPopup(conversation);

        // this.inbox.setFeedFilter();
        this.inbox.mount(this.container);

        // Play a sound when a message is recieved.
        this.inbox.on("open", () => {
          this.setState({
            opened: true,
          });
        });

        this.inbox.on("close", () => {
          this.setState({
            opened: false,
          });
        });

        var hidden = this.state.opened;
        window.talkSession.on("message", () => {
          if (!this.state.opened) {
            audio.play();
          }
        });
      })
      .catch((e) => console.error(e));
  }

  componentWillUnmount() {
    if (this.inbox) {
      this.inbox.destroy();
    }
  }

  render() {
    return (
      <span>
        <div
          style={{ height: "100%", width: "100%" }}
          ref={(c) => (this.container = c)}
        ></div>
      </span>
    );
  }
}

export default TextChat;
