// VONAGE
import classNames from "classnames";

import "opentok-solutions-css";

import "./VideoChat.css";
const OT = require("@opentok/client");

export const otCoreOptions = {
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
    connectionLimit: 2, // Possibly change to 2-3 for the production code
  },

  screenSharing: {
    extensionID: "plocfffmbcclpdifaikiikgplfnepkpo",
    annotation: false,
    appendControl: true,
    externalWindow: false,
    dev: true,
    screenProperties: {
      insertMode: "append",
      width: "100%",

      height: "100%",
      showControls: true,
      style: {
        buttonDisplayMode: "off",
      },
      videoSource: "window",
      fitMode: "cover", // Using default
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

export const otCoreOptions2 = {
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
    connectionLimit: 2, // Possibly change to 2-3 for the production code
  },

  screenSharing: {
    extensionID: "cfhdojbkjhnklbpkdaibdccddilifddb",
    annotation: false,
    appendControl: false,
    controlsContainer: false,
    externalWindow: false,
    dev: true,
    screenProperties: {
      insertMode: "append",
      width: "100%",

      height: "100%",
      showControls: true,
      style: {
        buttonDisplayMode: "off",
      },
      videoSource: "window",
      fitMode: "cover", // Using default
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
