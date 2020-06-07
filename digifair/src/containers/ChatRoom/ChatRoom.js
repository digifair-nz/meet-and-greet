import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Button from "../../components/UI/Button/Button";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";

import classes from "./ChatRoom.module.css";

import Spinner from "../../components/UI/Spinner/Spinner";
import * as actions from "../../store/actions/index";
import Aux from "../../hoc/Auxiliary";
import "opentok-solutions-css";
// VONAGE
import classNames from "classnames";
import AccCore from "opentok-accelerator-core";

import * as otCoreOptions from "./otCoreOptions";

// import * as otCoreOptions from "./otCoreOptions";

import { connect } from "react-redux";

import TextChat from "./TextChat/TextChat";

//import VideoChat from "./VideoChat/VideoChat";

const OT = require("@opentok/client");
let otCore;

/**
 * Build classes for container elements based on state
 * @param {Object} state
 */
const containerClasses = (state) => {
  const { active, meta, localAudioEnabled, localVideoEnabled } = state;
  const sharingScreen = meta ? !!meta.publisher.screen : false;
  const viewingSharedScreen = meta ? meta.subscriber.screen : false;
  const activeCameraSubscribers = meta ? meta.subscriber.camera : 0;
  const activeCameraSubscribersGt2 = activeCameraSubscribers > 2;
  const activeCameraSubscribersOdd = activeCameraSubscribers % 2;
  const screenshareActive = viewingSharedScreen || sharingScreen;
  return {
    controlClass: classNames("App-control-container", { hidden: !active }),
    localAudioClass: classNames("ots-video-control circle audio", {
      hidden: !active,
      muted: !localAudioEnabled,
    }),
    localVideoClass: classNames("ots-video-control circle video", {
      hidden: !active,
      muted: !localVideoEnabled,
    }),
    localCallClass: classNames("ots-video-control circle end-call", {
      hidden: !active,
    }),
    cameraPublisherClass: classNames("video-container", {
      hidden: !active,
      small: !!activeCameraSubscribers || screenshareActive,
      left: screenshareActive,
    }),
    screenPublisherClass: classNames("video-container", {
      hidden: !active || !sharingScreen,
    }),
    cameraSubscriberClass: classNames(
      "video-container",
      { hidden: !active || !activeCameraSubscribers },
      { "active-gt2": activeCameraSubscribersGt2 && !screenshareActive },
      { "active-odd": activeCameraSubscribersOdd && !screenshareActive },
      { small: screenshareActive }
    ),
    screenSubscriberClass: classNames("video-container", {
      hidden: !viewingSharedScreen || !active,
    }),
  };
};

const connectingMask = () => (
  <div className="App-mask">
    <Spinner />
    <div className="message with-spinner">Connecting</div>
    {}
  </div>
);

// const startCallMask = (start) => <div className="App-mask">{start()}</div>;

class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      active: false,
      publishers: null,
      subscribers: null,
      meta: null,
      localAudioEnabled: true,
      localVideoEnabled: true,
      connectionId: null,
      connections: [],
      loading: true,
      allowNextUser: true,
    };
    this.startCall = this.startCall.bind(this);
    this.endCall = this.endCall.bind(this);
    this.toggleLocalAudio = this.toggleLocalAudio.bind(this);
    this.toggleLocalVideo = this.toggleLocalVideo.bind(this);
    this.kickStudent = this.kickStudent.bind(this);
  }
  // state = {
  //   disconnect: false,
  // };
  kickStudentHandler = () => {
    this.props.kickStudent();
  };

  componentDidMount() {
    console.log(this.props.credentials);
    console.log(this.props.isStudent);
    const options = otCoreOptions.otCoreOptions;
    options.credentials = this.props.credentials;

    otCore = new AccCore(options);
    // Connect the user to the session and start the call
    otCore.connect().then(() => {
      this.setState({ connected: true });

      if (this.state.connected && !this.state.active) {
        this.startCall();
      }
    });

    // Event listener for client connecting to the session
    otCore.on("connectionCreated", (event) => {
      console.log(this.state);

      if (event.connection.connectionId != this.state.connectionId) {
        console.log("Another client connected.");
        if (this.state.connectionId != null) {
          if (this.state.connections.length < 2) {
            this.setState({
              allowNextUser: false,
            });
          }
          this.setState({
            connectionId: event.connection.connectionId,
          });
        }
        let connections = [...this.state.connections];
        connections.push(event.connection);
        this.setState({
          connections: connections,
        });
      }

      // Student Client Kicked
      if (this.props.isStudent) {
        otCore.on("sessionDisconnected", (event) => {
          // Clear students' credentials
          // Move them back to to the dashboard
          console.log("I got kicked :( ");

          this.props.studentLeaveSession();

          this.props.history.push("/");
        });
      }
    });
    // otCore.disconnect()
    const events = [
      "subscribeToCamera",
      "unsubscribeFromCamera",
      "subscribeToScreen",
      "unsubscribeFromScreen",
      "startScreenShare",
      "endScreenShare",
    ];

    events.forEach((event) =>
      otCore.on(event, ({ publishers, subscribers, meta }) => {
        this.setState({ publishers, subscribers, meta });
      })
    );
  }

  // componentDidUpdate(){

  // }

  startCall() {
    this.setState({
      loading: false,
    });
    otCore
      .startCall()
      .then(({ publishers, subscribers, meta }) => {
        if (!this.state.active) {
          this.setState({ publishers, subscribers, meta, active: true });
        }
      })
      .catch((error) => console.log(error));
  }

  kickStudent() {
    if (!this.props.isStudent) {
      // How do I kick a specific student..?
      if (this.state.connections.length < 2) {
        this.props.kickStudent();
      } else {
        otCore.forceDisconnect(this.state.connections[1]).then(() => {
          console.log("Kicked!!");
          let connections = [...this.state.connections];
          connections.pop();
          this.setState({
            connections: connections,
            allowNextUser: true,
          });

          this.forceUpdate();
          this.props.kickStudent();
        });
      }
    }
  }

  endCall() {
    otCore.endCall();

    this.setState({ active: false });
  }

  toggleLocalAudio() {
    otCore.toggleLocalAudio(!this.state.localAudioEnabled);
    this.setState({ localAudioEnabled: !this.state.localAudioEnabled });
  }

  toggleLocalVideo() {
    otCore.toggleLocalVideo(!this.state.localVideoEnabled);
    this.setState({ localVideoEnabled: !this.state.localVideoEnabled });
  }

  leaveEvent = () => {
    otCore.endCall();
    // Disconnect recruiter from the event
    // Don't allow the recruiter to leave the event unless the room is free

    this.props.logout();
  };
  render() {
    const { connected, active } = this.state;
    const {
      localAudioClass,
      localVideoClass,
      localCallClass,
      controlClass,
      cameraPublisherClass,
      screenPublisherClass,
      cameraSubscriberClass,
      screenSubscriberClass,
    } = containerClasses(this.state);
    return (
      <div className={classes.ChatRoomContainer}>
        <Toolbar
          isAuth={true}
          drawerToggleClicked={false}
          controlsLocation="ChatRoom"
        >
          {this.state.loading ? (
            <Aux>
              <span>Loading...</span>
              <Spinner />
            </Aux>
          ) : this.props.isStudent ? null : (
            <Aux>
              <Button btnType="Control">Tutorial</Button>
              {
                <Button
                  clicked={this.props.inviteNextStudent}
                  //disabled={this.state.allowNextUser}
                  btnType="Success"
                >
                  Invite Next User
                </Button>
              }
              {/* <Button btnType="Control">Take a break</Button> */}
              <Button clicked={this.kickStudent} btnType="Danger">
                Disconnect Student
              </Button>
              <Button
                clicked={this.leaveEvent}
                iconType="Logout"
                btnType="Logout"
              >
                Leave event
              </Button>
            </Aux>
          )}
        </Toolbar>
        <div className={classes.VideoChatContainer}>
          <div className="App-main">
            <div className="App-video-container">
              {!connected && connectingMask()}

              <div
                id="cameraPublisherContainer"
                className={cameraPublisherClass}
              />
              <div
                id="screenPublisherContainer"
                className={screenPublisherClass}
              />
              <div
                id="cameraSubscriberContainer"
                className={cameraSubscriberClass}
              />
              <div
                id="screenSubscriberContainer"
                className={screenSubscriberClass}
              />
              <div id="controls" className={controlClass}>
                <div
                  className={localAudioClass}
                  onClick={this.toggleLocalAudio}
                />
                <div
                  className={localVideoClass}
                  onClick={this.toggleLocalVideo}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={classes.TextChatContainer}>
          <TextChat name={this.props.myName} token={this.props.token} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    credentials: state.user.credentials,
    isStudent: state.user.isStudent,
    myName: state.user.name,
    token: state.user.token,
    //allowNextUser: state.user.allowNextUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    //kickStudent: () => dispatch(actions.studentLeaveSession()),
    logout: () => dispatch(actions.logout()),
    studentLeaveSession: () => dispatch(actions.studentLeaveSession()),
    kickStudent: () => dispatch(actions.kickStudent()),
    inviteNextStudent: () => dispatch(actions.inviteNextStudent()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ChatRoom)
);
