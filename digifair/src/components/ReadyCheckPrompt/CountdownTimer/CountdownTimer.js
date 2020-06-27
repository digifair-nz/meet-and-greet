import React, { Component } from "react";
import classes from "./CountdownTimer.module.css";

const COUNTDOWN_TIME = 10;

class CountdownTimer extends Component {
  state = {
    seconds: COUNTDOWN_TIME,
  };

  startTimer = () => {
    this.timer = setInterval(() => {
      if (this.state.seconds === 0) {
        clearInterval(this.timer);
        this.props.onTimerEnd();
      } else {
        console.log(this.state.seconds);
        this.setState((prevState) => {
          return {
            seconds: prevState.seconds - 1,
          };
        });
      }
    }, 1000);
  };

  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const durationStyle = {
      animationDuration: COUNTDOWN_TIME + "s",
    };

    return (
      <div className={classes.Countdown}>
        <div className={classes.CountdownNumber} style={durationStyle}>
          {this.state.seconds}
        </div>
        <svg>
          <circle r="36" cx="40" cy="40" style={durationStyle}></circle>
        </svg>
      </div>
    );
  }
}

export default CountdownTimer;
