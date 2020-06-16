import React, { Component } from "react";

import Button from "../UI/Button/Button";
import classes from "./ReadyCheckPrompt.module.css";
import CountdownTimer from "./CountdownTimer/CountdownTimer";

import { Redirect } from "react-router-dom";

import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
class ReadyCheckPrompt extends Component {
  // If the student accepts the queue, he will be redirected to the video chat room with the recruiter

  state = {
    clicked: false,
  };
  onAcceptHandler = () => {
    console.log("-------------Check");
    if (!this.state.clicked) {
      console.log("Check");
      this.setState({
        clicked: true,
      });
      document.title = "Dashboard";

      this.props.studentJoinChatroom(this.props.companyId);
    }
    // this.this.props.history.push("/chat-room");
  };

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevProps !== this.props) {
  //     this.setState({
  //       clicked: false,
  //     });
  //   }
  // }
  // If the student declines the queue he will be ejected from the queue and close the pop up
  onDeclineHandler = () => {
    document.title = "Dashboard";
    this.props.onDeclineHandler();
    this.props.declineJoinChatroom(this.props.companyId, this.props.index);
  };

  timerExpireHandler = () => {
    //do something
    alert("[Company Name] has sent you an invite, but you did not respond.");
    this.onDeclineHandler();
  };

  render() {
    let redirect = null;
    if (this.props.credentials !== null) {
      redirect = <Redirect to="/chat-room" />;
    }
    return (
      <div className={classes.PromptContainer}>
        {redirect}
        <img
          className={classes.Logo}
          src={this.props.logo}
          alt="Company logo"
        />
        <div className={classes.ContentContainer}>
          <span>The company is ready for you!</span>
          <CountdownTimer onTimerEnd={this.timerExpireHandler} />
          <span>Ready?</span>
        </div>
        <div className={classes.ButtonContainer}>
          <Button
            onClick={this.props.onClick}
            clicked={this.onAcceptHandler}
            btnType="Accept"
          >
            Accept
          </Button>
          <Button clicked={this.onDeclineHandler} btnType="Decline">
            Decline
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    credentials: state.user.credentials,
    error: state.user.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    declineJoinChatroom: (companyId, index) =>
      dispatch(actions.declineJoinChatroom(companyId, index)),
    studentJoinChatroom: (companyId) => {
      dispatch(actions.studentJoinChatroom(companyId));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReadyCheckPrompt);
