import React, { Component } from "react";

import userIcon from "../../assets/icons/person.png";
import clockIcon from "../../assets/icons/clock.png";
import arrow from "../../assets/icons/double-angle.png";
import arrowDown from "../../assets/icons/double-angles-down.png";

import classes from "./SessionInfoCard.module.css";

import EventTimer from "../EventTimer/EventTimer";

class SessionInfoCard extends Component {
  state = {
    show: false,
    minutes: 0,
    seconds: 0,
  };

  toggleCloseSessionInfo = () => {
    this.setState({
      show: !this.state.show,
    });
  };

  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextProps.startTimer !== this.props.startTimer;
  // }

  startTimer = () => {
    // Might consider saving duration
    if (this.props.startTimer) {
      this.timer = setInterval(() => {
        if (this.state.seconds === 60) {
          this.setState((prevState) => {
            return {
              minutes: prevState.minutes + 1,
              seconds: 0,
            };
          });
        } else {
          this.setState((prevState) => {
            return {
              seconds: prevState.seconds + 1,
            };
          });
        }
      }, 1000);
    }
  };
  componentDidMount() {
    this.startTimer();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.startTimer !== prevProps.startTimer) {
      this.startTimer();
    }
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    let infoCard = (
      <div className={classes.InfoCardContainerClosed}>
        <img
          src={arrow}
          className={classes.ArrowUp}
          alt="two arrows pointing up"
          onClick={this.toggleCloseSessionInfo}
        />
      </div>
    );
    if (this.state.show) {
      infoCard = (
        <div className={classes.InfoCardContainer}>
          <img
            src={arrowDown}
            className={classes.Arrow}
            alt="two arrows pointing down"
            onClick={this.toggleCloseSessionInfo}
          />
          <div>
            <div className={classes.SessionInfoContainer}>
              <span className={classes.ContainerTitle}>Session Info</span>
              <div className={classes.IconContainer}>
                <img
                  src={userIcon}
                  className={classes.Icon}
                  alt="person siluethe icon"
                />
                <span>{this.props.queuedStudentsNum}</span>
              </div>
            </div>
            <div className={classes.TimerContainer}>
              <img src={clockIcon} className={classes.Icon} alt="clock icon" />
              <span>
                {this.state.minutes > 9
                  ? this.state.minutes
                  : "0" + this.state.minutes}
                :
                {this.state.seconds > 9
                  ? this.state.seconds
                  : "0" + this.state.seconds}
              </span>
            </div>
          </div>
          <div className={classes.EventInfo}>
            <span className={classes.ContainerTitle}>Event Info</span>
            <span className={classes.EventName}>{this.props.eventName}</span>
            <EventTimer eventExpiration={this.props.eventExpiration} />
          </div>
        </div>
      );
    }
    return infoCard;
  }
}
export default SessionInfoCard;
