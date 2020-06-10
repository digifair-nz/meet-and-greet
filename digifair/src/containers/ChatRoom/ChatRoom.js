import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

// Vonage API for video call imports
import * as otCoreOptions from "./otCoreOptions";
import AccCore from "opentok-accelerator-core";
import "opentok-solutions-css";
import classNames from "classnames";

// Components
import Aux from "../../hoc/Auxiliary";
import Button from "../../components/UI/Button/Button";
import NameCard from "../../components/NameCard/NameCard";
import Spinner from "../../components/UI/Spinner/Spinner";
import TextChat from "./TextChat/TextChat";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";

// Redux actions
import * as actions from "../../store/actions/index";

// Style

import classes from "./ChatRoom.module.css";

// import * as otCoreOptions from "./otCoreOptions";

//const OT = require("@opentok/client");
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
    console.log("CHAT ROOM MOUNTED");
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

    otCore.on("connectionCreated", (event) => {
      if (event.connection.connectionId != this.state.connectionId) {
        // Check if this is an initial connection (for the recruiter)
        if (this.state.connectionId === null) {
          console.log("I have connected");
          let connections = []; // Initially there are no connections
          connections.push(event.connection); // push his connection

          this.setState({
            connectionId: event.connection.connectionId,
            connections: connections,
          });
        } else {
          // Recruiter has already joined
          console.log("Another client connected.");
          if (!this.props.isStudent) {
            this.props.fetchStudentData(); // Get student's data for talkJS
          }

          if (this.state.connections.length > 0) {
            let connections = [...this.state.connections];
            connections.push(event.connection);
            this.setState({
              allowNextUser: false,
              connections: connections,
            });
          }
        }
      }
    });
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


  // componentDidUpdate(prevProps, prevState) {
  //   console.log("Check");
  //   if (!this.props.isStudent) {
  //     // console.log(prevProps.credentials.sessionId);
  //     // console.log("--------------------------------");
  //     // console.log(this.props.credentials.sessionId);

  //     if (this.props.credentials.sessionId != prevProps.credentials.sessionId) {
  //       console.log("Called");
  //       console.log(this.state.connectionId);
  //       otCore.endCall();

  //       this.setState({
  //         connected: false,
  //         acitve: false,
  //         publishers: null,
  //         subscriber: null,
  //         connectionId: null,
  //         connections: null,
  //         loading: true,
  //       });

  //       // connected: false,
  //       // active: false,
  //       // publishers: null,
  //       // subscribers: null,
  //       // meta: null,
  //       // localAudioEnabled: true,
  //       // localVideoEnabled: true,
  //       // connectionId: null,
  //       // connections: [],
  //       // loading: true,
  //       // allowNextUser: true,

  //       const options = otCoreOptions.otCoreOptions;
  //       options.credentials = this.props.credentials;
  //       console.log(this.props.credentials);
  //       otCore = new AccCore(options);

  //       // Connect the user to the session and start the call
  //       otCore.connect().then(() => {
  //         this.setState({ connected: true });

  //         this.startCall();
  //       });

  //       // Event listener for client connecting to the session
  //       otCore.on("connectionCreated", (event) => {
  //         if (event.connection.connectionId != this.state.connectionId) {
  //           // Check if this is an initial connection (for the recruiter)
  //           if (this.state.connectionId === null) {
  //             console.log("I have connected");
  //             let connections = []; // Initially there are no connections
  //             connections.push(event.connection); // push his connection

  //             this.setState({
  //               connectionId: event.connection.connectionId,
  //               connections: connections,
  //             });
  //           } else {
  //             // Recruiter has already joined
  //             console.log("Another client connected.");
  //             if (this.state.connections.length > 0) {
  //               let connections = [...this.state.connections];
  //               connections.push(event.connection);
  //               this.setState({
  //                 allowNextUser: false,
  //                 connections: connections,
  //               });
  //             }
  //           }
  //         }
  //       });
  //       // otCore.disconnect()
  //       const events = [
  //         "subscribeToCamera",
  //         "unsubscribeFromCamera",
  //         "subscribeToScreen",
  //         "unsubscribeFromScreen",
  //         "startScreenShare",
  //         "endScreenShare",
  //       ];
  //       // Student Client Kicked
  //       if (this.props.isStudent) {
  //         otCore.on("sessionDisconnected", (event) => {
  //           // Clear students' credentials
  //           // Move them back to to the dashboard
  //           console.log("I got kicked :( ");

  //           this.props.studentLeaveSession();

  //           this.props.history.push("/");
  //         });
  //       }
  //       events.forEach((event) =>
  //         otCore.on(event, ({ publishers, subscribers, meta }) => {
  //           this.setState({ publishers, subscribers, meta });
  //         })
  //       );
  //     }
  //   }

  //   //console.log(prevState);
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
    console.log(this.state);
    if (!this.props.isStudent) {
      // Kick the user with the connectionId that is not mine

      // Check that the connection is loaded
      if (this.state.connections != null) {
        // If there are less than 2 users in the session do nothing
        if (this.state.connections.length > 1) {
          // Itterate through the connections
          for (let i = 0; i < this.state.connections.length; i++) {
            // If the connection doesn't have my id we want to kick this user
            if (
              this.state.connectionId != this.state.connections[i].connectionId
            ) {
              //Kick the student with a different connection id
              otCore.forceDisconnect(this.state.connections[i]).then(() => {
                console.log("Kicked!!");
                let connections = [...this.state.connections];
                connections.pop();
                this.setState({
                  connections: connections,
                  allowNextUser: true,
                });

                this.props.kickStudent();
              });
            }
          }
        }
      }
    }
  }

  leaveSession = () => {
    console.log("Hello");
    otCore.endCall();
    this.props.history.push("/");
    this.props.studentLeaveSession();
  };

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
    console.log(this.props.talkJSData);

    let textChat = null;
    let nameCard = null;
    if (this.props.talkJSData) {
      textChat = (
        <TextChat
          name={this.props.myName}
          id={this.props.myId}
          talkJSData={this.props.talkJSData}
        />
      );
      nameCard = (
        // This is the name of the person they are chatting with.

        <NameCard
          name={this.props.talkJSData.name}
          isStudent={this.props.isStudent}
          searching={false}
        />
      );
    } else {
      nameCard = (
        // This is the name of the person they are chatting with.

        <NameCard isStudent={this.props.isStudent} searching={true} />
      );
    }

    console.log(this.state);
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
        {nameCard}
        <Toolbar
          isAuth={true}
          drawerToggleClicked={false}
          controlsLocation="ChatRoom"
        >
          {this.state.loading ? (
            <Aux>
              <Spinner spinnerColor="White" />
            </Aux>
          ) : this.props.isStudent ? (
            <Aux>
              <Button btnType="Danger" clicked={this.leaveSession}>
                Leave Session
              </Button>
            </Aux>
          ) : (
            <Aux>
              <Button btnType="Control">Tutorial</Button>
              {
                <Button
                  clicked={this.props.inviteNextStudent}
                  disabled={!this.state.allowNextUser}
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
        <div className={classes.TextChatContainer}>{textChat}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    credentials: state.user.credentials,
    isStudent: state.user.isStudent,
    myName: state.user.name,
    myId: state.user.id,
    talkJSData: state.user.talkJSData,
    loadingTextChat: state.user.loading,
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
    fetchStudentData: () => dispatch(actions.fetchStudentData()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ChatRoom)
);
