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
import ErrorPopup from "../../components/ErrorPopup/ErrorPopup";
import RecruiterTutorial from "../../components/TutorialSlider/RecruiterTutorial/RecruiterTutorial";
import NameCard from "../../components/NameCard/NameCard";
import InfoCard from "../../components/InfoCard/InfoCard";
import Spinner from "../../components/UI/Spinner/Spinner";
import TextChat from "./TextChat/TextChat";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";

// Redux actions
import * as actions from "../../store/actions/index";

// Style

import classes from "./ChatRoom.module.css";

const OT = require("@opentok/client");
// import * as otCoreOptions from "./otCoreOptions";

var otCore;

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
      allowKicking: false,
      searching: false,
      studentLeft: false,
      showTutorial: false,
      buttonClicked: false, // This is a guard to prevent multiple clicking and spamming requests
    };
    this.startCall = this.startCall.bind(this);
    this.endCall = this.endCall.bind(this);
    this.toggleLocalAudio = this.toggleLocalAudio.bind(this);
    this.toggleLocalVideo = this.toggleLocalVideo.bind(this);
    this.kickStudent = this.kickStudent.bind(this);
  }

  kickStudentHandler = () => {
    this.props.kickStudent();
  };

  componentDidMount() {
    // console.log("CHAT ROOM MOUNTED");
    // console.log(this.props.credentials);
    // console.log(this.props.isStudent);

    let seenTutorial = localStorage.getItem("seenTutorial");

    let searching = localStorage.getItem("searching");

    if (searching) {
      this.setState({
        searching: true,
      });
    }
    if (!seenTutorial) {
      this.setState({
        showTutorial: true,
      });
    }

    document.title = "Session";
    console.log(
      "----------------------------- CREDENTIALS-----------------------------------"
    );
    console.log(this.props.credentials);

    if (this.props.credentials) {
      if (!this.props.isStudent) {
        const studentLeft = localStorage.getItem("studentLeft");
        if (studentLeft) {
          // If the student has left the recruiter, and the recruiter refreshes the tab,
          // then this state is persistant and we can allow the recruiter to disconnect the student
          this.setState({
            studentLeft: studentLeft,
            allowKicking: true,
          });
        }
      }

      const options = otCoreOptions.otCoreOptions;
      options.credentials = this.props.credentials;

      otCore = new AccCore(options);

      /* If the student leaves the room for too long by closing the tab or losing the connection (enough so that the recruiter has already switched sessions)
         We want to inform him that he is by himself. Execute set-timeout after 30seconds   
      */
      if (this.props.credentials) {
        setTimeout(() => {
          const inRoom = localStorage.getItem("inRoom");
          if (
            this.props.isStudent &&
            this.state.connections.length < 2 &&
            inRoom
          ) {
            alert(
              "Looks like you are no longer in a session with a recruiter. Please leave this room and get back to the main event (leave session button in the menu)"
            );
          }
        }, 5000);
      }

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
            //console.log("I have connected");
            let connections = []; // Initially there are no connections
            connections.push(event.connection); // push his connection

            if (this.props.isStudent) {
              localStorage.setItem("inRoom", true);
            }

            this.setState({
              connectionId: event.connection.connectionId,
              connections: connections,
            });
          } else {
            // Recruiter has already joined
            //console.log("Another client connected.");
            if (!this.props.isStudent) {
              this.props.fetchStudentData(); // Get student's data for talkJS
            }

            if (this.state.connections.length > 0) {
              if (this.props.isStudent && this.state.connections.length > 1) {
                // When the recruiter refrehses their tab too, cause the student's connection to be reset
                //alert("Session connection disrupted. Reconnecting...");
                //window.location.reload(false);
              } else {
                // If the student first joins in
                let connections = [...this.state.connections];
                connections.push(event.connection);

                this.setState({
                  allowNextUser: false,
                  connections: connections,
                  searching: false,
                  allowKicking: true,
                  studentLeft: false,
                });
              }
            }
          }
        }
      });
      // Student Client Kicked
      if (this.props.isStudent) {
        otCore.on("sessionDisconnected", (event) => {
          //console.log(event);
          // Clear students' credentials
          // Move them back to to the dashboard
          localStorage.removeItem("inRoom");

          otCore.off();
          otCore.endCall();
          otCore.session.destroy();

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
      if (!this.props.isStudent) {
        // Detect when the student loses connection from the session either by closing the tab or losing internet connection.
        // WARNING: When the student refreshes the tab or loses connection briefly, they might be kicked.
        otCore.on("connectionDestroyed", (event) => {
          // If the student loses connection for 10 seconds we can notify the recruiter if he wants to disonnect the student permanently and change session

          setTimeout(() => {
            if (this.state.connections.length < 3) {
              alert(
                "Looks like the student has lost a connection. You can disconnect the student permanently if you want to change sessions and then invite the next user."
              );
            }
          }, 10000);
          localStorage.setItem("studentLeft", true);
          this.setState({
            allowKicking: true,
            studentLeft: true,
          });
        });
      } else {
        otCore.on("connectionDestroyed", (event) => {
          /*
        EXPERIMENTAL!!

        This is done to sync the sessions but we want the student to load later than the recruiter. 
        So they have different conneciton Ids
        */
          setTimeout(() => {
            window.location.reload(false);
          }, 2000);
        });
      }

      otCore.on("sessionDisconnected", (event) => {});
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (!this.props.isStudent) {
      if (this.props.credentials.sessionId != prevProps.credentials.sessionId) {
        //otCore.session.connect();
        window.location.reload(false);
      }
    }
  }

  // Tutorial shows initially automatically but can be open
  showTutorial = () => {
    this.setState({
      showTutorial: true,
    });
  };

  // Closing the tutorial
  closeTutorial = () => {
    this.setState({
      showTutorial: false,
    });
    localStorage.setItem("seenTutorial", true);
  };
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
    //console.log(otCore);
    //console.log(this.state);

    if (this.state.connections != null && !this.state.buttonClicked) {
      if (
        !this.props.isStudent &&
        this.state.connections.length > 1 &&
        !this.state.studentLeft
      ) {
        // Kick the user with the connectionId that is not mine

        // Check that the connection is loaded

        // If there are less than 2 users in the session do nothing

        // Itterate through the connections
        for (let i = 0; i < this.state.connections.length; i++) {
          // If the connection doesn't have my id we want to kick this user
          if (
            this.state.connectionId != this.state.connections[i].connectionId
          ) {
            //Kick the student with a different connection id
            // console.log(this.state);
            // console.log(this.state.connections[i]);
            // console.log(otCore.session);
            this.setState({
              clicked: true,
            });
            otCore.forceDisconnect(this.state.connections[i]).then(() => {
              localStorage.removeItem("studentLeft");
              localStorage.removeItem("searching");
              this.props.kickStudent();
            });
            //this.props.kickStudent();
          }
        }
      } else if (
        !this.props.isStudent &&
        // this.state.connections.length > 1 &&
        this.state.studentLeft
      ) {
        localStorage.removeItem("studentLeft");
        localStorage.removeItem("searching");
        this.props.kickStudent();
      }
    }
  }

  leaveSession = () => {
    localStorage.removeItem("inRoom");

    otCore.off();
    otCore.endCall();
    otCore.session.destroy();

    //otCore.session.connections.destroy();
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
    localStorage.removeItem("studentLeft");

    localStorage.removeItem("searching");
    otCore.endCall();
    // Disconnect recruiter from the event
    // Don't allow the recruiter to leave the event unless the room is free

    this.props.logout();
  };

  inviteNextStudent = () => {
    if (this.state.connections != null && !this.state.searching) {
      if (this.state.connections.length < 2) {
        this.props.inviteNextStudent();
        localStorage.setItem("searching", true);
        this.setState({
          searching: true,
        });
      }
    }
  };

  errorConfirmedHandler = () => {
    this.props.clearError();
  };
  render() {
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
          searching={this.state.searching}
        />
      );
    } else {
      if (this.state.searching) {
        nameCard = (
          // This is the name of the person they are chatting with.

          <NameCard
            isStudent={this.props.isStudent}
            searching={this.state.searching}
          />
        );
      } else {
        nameCard = null;
      }
    }
    const inRoom = localStorage.getItem("inRoom");
    if (this.state.connections) {
      if (this.props.isStudent && this.state.connections.length < 2 && inRoom) {
        nameCard = null;
        textChat = null;
      }
    }

    let { connected, active } = this.state;
    let {
      localAudioClass,
      localVideoClass,
      controlClass,
      cameraPublisherClass,
      screenPublisherClass,
      cameraSubscriberClass,
      screenSubscriberClass,
    } = containerClasses(this.state);

    console.log(this.state.connections);
    return (
      <div className={classes.ChatRoomContainer}>
        {/*This shows the recruiter user a tutorial of the platform covering kicking, inviting, chatting and video controlling  */}
        <RecruiterTutorial
          closeTutorial={this.closeTutorial}
          showTutorialSlider={this.state.showTutorial}
        />
        {/*This shows the recruiter information regarding the session (number of students queued and session duration) and the event (event name and timer) */}
        {!this.props.isStudent ? (
          <InfoCard
            eventName={this.props.event.eventName}
            queuedStudentsNum={12}
            eventExpiration={this.props.event.eventExpiration}
            startTimer={this.state.connections.length > 1}
          />
        ) : null}
        <ErrorPopup
          show={this.props.error}
          modalClosed={this.errorConfirmedHandler}
          error={this.props.error}
        />
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
              <Button
                btnType="Danger"
                btnStyle={{ height: "5vh" }}
                clicked={this.leaveSession}
              >
                Leave Session
              </Button>
            </Aux>
          ) : (
            <Aux>
              <Button clicked={this.showTutorial} btnType="Control">
                Tutorial
              </Button>
              {
                <Button
                  clicked={this.inviteNextStudent}
                  disabled={
                    // !this.state.allowNextUser ||
                    // this.state.allowKicking ||
                    this.state.searching
                  }
                  btnType="Success"
                >
                  Invite Next User
                </Button>
              }
              {/* <Button btnType="Control">Take a break</Button> */}
              <Button
                disabled={
                  this.state.searching || !this.state.allowKicking
                  // this.state.connections.length < 2 ||
                  // !this.state.allowKicking ||
                  // !this.state.studentLeft
                }
                clicked={this.kickStudent}
                btnType="Danger"
              >
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
    error: state.user.error,
    event: state.event,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(actions.logout()),
    studentLeaveSession: () => dispatch(actions.studentLeaveChatroom()),
    kickStudent: () => dispatch(actions.kickStudent()),
    inviteNextStudent: () => dispatch(actions.inviteNextStudent()),
    fetchStudentData: () => dispatch(actions.fetchStudentData()),
    fetchQueuedStudentsNum: () => dispatch(actions.fetchQueuedStudentsNum()),
    clearError: () => dispatch(actions.clearError()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ChatRoom)
);
