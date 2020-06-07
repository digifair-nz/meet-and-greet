import React, { Component } from "react";

import Talk from "talkjs";

class TextChat extends Component {
  constructor(props) {
    super(props);

    this.inbox = undefined;
  }

  // shouldComponentUpdate() {

  // }
  componentDidMount() {
    // Promise can be `then`ed multiple times
    Talk.ready
      .then(() => {
        const me = new Talk.User({
          id: this.props.token,
          name: this.props.name,
          role: "Student",
          email: "george@looney.net",

          welcomeMessage: "Hey there! How are you? :-)",
        });

        if (!window.talkSession) {
          window.talkSession = new Talk.Session({
            appId: "tlKy3Mz6",
            me: me,
          });
        }

        const other = new Talk.User({
          id: "543121",
          name: "John Motor",
          role: "Recruiter",
          email: "ronald@teflon.com",

          welcomeMessage: "Hey there! Love to chat :-)",
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
