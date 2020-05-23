import React, { Component } from "react";

import Button from "../../components/UI/Button/Button";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";

import classes from "./ChatRoom.module.css";

import "opentok-solutions-css";
// import * as otCoreOptions from "./otCoreOptions";
import "./VideoChat.css";
import { connect } from "react-redux";

import TextChat from "./TextChat/TextChat";
import VideoChat from "./VideoChat/VideoChat";

class ChatRoom extends Component {
  render() {
    return (
      <div className={classes.ChatRoomContainer}>
        <Toolbar
          isAuth={true}
          drawerToggleClicked={false}
          controlsLocation="ChatRoom"
        >
          <Button btnType="Control">Open Queue</Button>
          <Button btnType="Success">Invite Next User</Button>
          <Button btnType="Control">Take a break</Button>
          <Button btnType="Danger">End Current Session</Button>
          <Button iconType="Logout" btnType="Logout">
            Leave event
          </Button>
        </Toolbar>
        <div className={classes.VideoChatContainer}>
          <VideoChat credentials={this.props.credentials} />
        </div>
        <div className={classes.TextChatContainer}>
          <TextChat />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    credentials: state.studentAuth.credentials,
  };
};

// const mapDispatchToProps = (dispatch) => {
//   return {
//     onAuth: (email, password) => dispatch(actions.studentAuth(email, password)),
//     onSetAuthRedirectPath: () =>
//       dispatch(actions.setStudentAuthRedirectPath("/")),
//   };
// };

export default connect(mapStateToProps)(ChatRoom);
