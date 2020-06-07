import React, { Component } from "react";

import Spinner from "../../../components/UI/Spinner/Spinner";

import { connect } from "react-redux";
// VONAGE
import classNames from "classnames";
import AccCore from "opentok-accelerator-core";
import "opentok-solutions-css";
import * as otCoreOptions from "./otCoreOptions";
import "./VideoChat.css";
import { withRouter } from "react-router-dom";
import * as actions from "../../../store/actions/index";
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

class VideoChat extends Component {
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
    };
    this.startCall = this.startCall.bind(this);
    this.endCall = this.endCall.bind(this);
    this.toggleLocalAudio = this.toggleLocalAudio.bind(this);
    this.toggleLocalVideo = this.toggleLocalVideo.bind(this);
    this.kickStudent = this.kickStudent.bind(this);
  }

  componentDidMount() {
    console.log(this.props.isStudent);
    const options = otCoreOptions.otCoreOptions;
    options.credentials = this.props.credentials;

    otCore = new AccCore(options);
    otCore.connect().then(() => {
      this.setState({ connected: true });

      if (this.state.connected && !this.state.active) {
        this.startCall();
      }
    });

    // otCore.on({
    //   connectionCreated: function (event) {
    //     console.log(otCore);
    //     if (event.connection.connectionId != this.state.connectionId) {
    //       console.log("Another client connected.");
    //       console.log(event);
    //       let connections = [...this.state.connections];
    //       connections.push(event.connection);
    //       this.setState({
    //         connectionId: event.connection.connectionId,
    //         connections: connections,
    //       });
    //     }
    //   },
    // });

    otCore.on("connectionCreated", (event) => {
      console.log(this.state);

      if (event.connection.connectionId != this.state.connectionId) {
        console.log("Another client connected.");
        if (this.state.connectionId != null) {
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

      // otCore.on("sessionDisconnected", function (event) {
      //   alert("The session disconnected. " + event.reason);
      //   //this.props.studentLeaveSession();
      // });
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

  startCall() {
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
          });
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
      <div className="App-main">
        <div className="App-video-container">
          {!connected && connectingMask()}

          <div id="cameraPublisherContainer" className={cameraPublisherClass} />
          <div id="screenPublisherContainer" className={screenPublisherClass} />
          <div
            id="cameraSubscriberContainer"
            className={cameraSubscriberClass}
          />
          <div
            id="screenSubscriberContainer"
            className={screenSubscriberClass}
          />
          <div id="controls" className={controlClass}>
            <div className={localAudioClass} onClick={this.toggleLocalAudio} />
            <div className={localVideoClass} onClick={this.toggleLocalVideo} />
            <div onClick={this.kickStudent}>Kick Student</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    studentLeaveSession: () => dispatch(actions.studentLeaveSession()),
    kickStudent: () => dispatch(actions.kickStudent()),
  };
};

export default withRouter(connect(null, mapDispatchToProps)(VideoChat));
