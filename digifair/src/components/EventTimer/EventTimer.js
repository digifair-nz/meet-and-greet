import React from "react";
import Countdown, { zeroPad } from "react-countdown-now";

import classes from "./EventTimer.module.css";
import clockIcon from "../../assets/icons/clock.png";
const eventTimer = (props) => {
  const renderer = ({ hours, minutes, seconds, completed }) => {
    return (
      <span className={classes.Time}>
        {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
      </span>
    );
  };

  const expiration = new Date(props.eventExpiration);
  return (
    <div className={classes.EventTimerContainer}>
      <img
        src={clockIcon}
        alt="Black Clock icon"
        className={classes.ClockIcon}
      />
      <Countdown date={expiration} renderer={renderer} />
    </div>
  );
};
export default eventTimer;
