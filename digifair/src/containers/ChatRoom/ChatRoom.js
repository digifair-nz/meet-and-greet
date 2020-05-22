import React, { Component } from "react";
import Aux from "../../hoc/Auxiliary";

import Button from "../../components/UI/Button/Button";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import Spinner from "../../components/UI/Spinner/Spinner";
import classes from "./ChatRoom.module.css";

// VONAGE
import classNames from "classnames";
import AccCore from "opentok-accelerator-core";
import "opentok-solutions-css";
import config from "./config.json";
import "./VideoChat.css";
const OT = require("@opentok/client");
let otCore;

const otCoreOptions = {
  credentials: {
    apiKey: config.apiKey,
    sessionId: config.sessionId,
    token: config.token,
  },

  streamContainers(pubSub, type, data, stream) {
    return {
      publisher: {
        camera: "#cameraPublisherContainer",
        screen: "#screenPublisherContainer",
      },
      subscriber: {
        camera: "#cameraSubscriberContainer",
        screen: "#screenSubscriberContainer",
      },
    }[pubSub][type];
  },
  controlsContainer: "#controls",
  packages: ["screenSharing", "annotation"],

  //https://www.npmjs.com/package/opentok-accelerator-core#communication-options
  communication: {
    callProperties: null, // Using default
    connectionLimit: null, // Possibly change to 2-3 for the production code
  },

  screenSharing: {
    extensionID: "plocfffmbcclpdifaikiikgplfnepkpo",
    annotation: true,
    externalWindow: false,
    dev: true,
    screenProperties: {
      insertMode: "append",
      width: "100%",
      height: "100%",
      showControls: false,
      style: {
        buttonDisplayMode: "off",
      },
      videoSource: "window",
      fitMode: "contain", // Using default
    },
  },
  annotation: {
    colors: ["red"],
    items: null,
    absoluteParent: {
      publisher: ".App-video-container",
      subscriber: ".App-video-container",
    },
  },
};

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
  </div>
);

const startCallMask = (start) => (
  <div className="App-mask">
    <button
      // disabled={boolean}
      className="message button clickable"
      onClick={start}
    >
      Click to Start Call{" "}
    </button>
  </div>
);

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
    };
    this.startCall = this.startCall.bind(this);
    this.endCall = this.endCall.bind(this);
    this.toggleLocalAudio = this.toggleLocalAudio.bind(this);
    this.toggleLocalVideo = this.toggleLocalVideo.bind(this);
  }

  componentDidMount() {
    otCore = new AccCore(otCoreOptions);
    otCore.connect().then(() => this.setState({ connected: true }));
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
        this.setState({ publishers, subscribers, meta, active: true });
      })
      .catch((error) => console.log(error));
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
          <div className="App-main">
            <div className="App-video-container">
              {!connected && connectingMask()}
              {connected && !active && startCallMask(this.startCall)}
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
                <div className={localCallClass} onClick={this.endCall} />
              </div>
            </div>
          </div>
        </div>
        <div className={classes.TextChatContainer}>Text chat</div>
      </div>
    );
  }
}
export default ChatRoom;
