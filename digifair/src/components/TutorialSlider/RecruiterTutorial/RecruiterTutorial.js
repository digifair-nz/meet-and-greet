import React, { Component } from "react";

import Aux from "../../../hoc/Auxiliary";
import Button from "../../UI/Button/Button";
import Modal from "../../UI/Modal/Modal";

import classes from "./Recruiter.module.css";

import relaxedWorker from "../../../assets/screen-images/relaxed-worker.png";
import textChatIcon from "../../../assets/icons/talkJsIcon.png";
import errorIcon from "../../../assets/icons/error.png";
import DigifairLogo from "../../../assets/company_logos/digifair-logo-black.png";
import studentIcon from "../../../assets/icons/black-student_hat.png";
import userIcon from "../../../assets/icons/person.png";

class RecruiterSlider extends Component {
  state = {
    currentSlider: 0,
  };

  nextSlide = () => {
    this.setState({
      currentSlider: this.state.currentSlider + 1,
    });
  };

  prevSlide = () => {
    this.setState({
      currentSlider: this.state.currentSlider - 1,
    });
  };

  finishTutorial = () => {
    this.props.closeTutorial();
  };

  render() {
    let slides = [];

    slides[0] = (
      <Aux>
        <h1>Welcome to DIGIFAIR</h1>
        <span>
          This short tutorial will walk you through all of the features of this
          application.
        </span>
        <img
          src={relaxedWorker}
          alt="Digital worker on a hammock with a computer and a plant"
          className={classes.RelaxedWorkerImage}
        />
        <button onClick={this.nextSlide} className={classes.ControlButtonNext}>
          Next
        </button>
        <button
          onClick={this.finishTutorial}
          className={classes.ControlButtonPrev}
        >
          Skip Tutorial
        </button>
      </Aux>
    );

    slides[1] = (
      <Aux>
        <h1 className={classes.SlideTitle}>Disconnecting Users</h1>
        <span>
          The session control buttons can be found on the slider menu on the
          left <br /> (press on the hamburger menu below the logo).
        </span>
        <div className={classes.ButtonContainer}>
          <button className={classes.Button}>Disonnect Student</button>
          <span className={classes.ButtonText}>
            This button is responsible for permanently kicking the student from
            the session. It will cause you to jump into a new session.
          </span>
        </div>
        <div className={classes.TextContainer}>
          <span>
            <strong>
              You should always disconnect the session before finding the next
              user.
              <br />
            </strong>
            It is possible that students lose connection or leave the session
            themselves, <br />
            in which case{" "}
            <strong>you still need to click on the disconnect button</strong>
          </span>
        </div>
        <button onClick={this.nextSlide} className={classes.ControlButtonNext}>
          Next
        </button>
        <button onClick={this.prevSlide} className={classes.ControlButtonPrev}>
          Previous
        </button>
      </Aux>
    );

    slides[2] = (
      <Aux>
        <h1 className={classes.SlideTitle}>Inviting the Next User</h1>

        <div className={classes.ButtonContainer}>
          <button
            style={{ backgroundColor: "#60bf33", color: "black" }}
            className={classes.Button}
          >
            Invite Next User
          </button>

          <span className={classes.ButtonText}>
            This button is responsible for opening your room for the next queued
            user. After you have kicked the user and jumped to a new session,
            when you are ready you can get next user.
          </span>
        </div>
        <div className={classes.TextContainer}>
          <span>
            <strong>
              Initially, you can begin the search without disconnecting.
              <br /> After, you should always disconnect the student first.
            </strong>
          </span>
        </div>
        <button onClick={this.nextSlide} className={classes.ControlButtonNext}>
          Next
        </button>
        <button onClick={this.prevSlide} className={classes.ControlButtonPrev}>
          Previous
        </button>
      </Aux>
    );

    slides[3] = (
      <Aux>
        <h1 className={classes.SlideTitle}>Video Controls</h1>

        <div className={classes.VideoControlsContainer}>
          <div className={classes.MicIcon}></div>
          <div className={classes.CameraIcon}></div>
          <div className={classes.ScreenShareIcon}></div>
        </div>

        <span>
          The above are Microphone Mute, Camera Toggle and Screen Share.
          <br /> They are available for students to use also.
        </span>

        <button onClick={this.nextSlide} className={classes.ControlButtonNext}>
          Next
        </button>
        <button onClick={this.prevSlide} className={classes.ControlButtonPrev}>
          Previous
        </button>
      </Aux>
    );

    slides[4] = (
      <Aux>
        <h1 className={classes.SlideTitle}>Text Chat</h1>

        <img src={textChatIcon} className={classes.TextChatIcon} />
        <span className={classes.TextChatLabel}>
          This text bubble icon will appear when the student connects to the
          session.
          <br />
          You can exchange messages through this chat during the session
          duration. <br />
          Your conversation is not stored and no user can see the previous
          conversation.
        </span>

        <button onClick={this.nextSlide} className={classes.ControlButtonNext}>
          Next
        </button>
        <button onClick={this.prevSlide} className={classes.ControlButtonPrev}>
          Previous
        </button>
      </Aux>
    );

    // Name card , session duration, students queued
    slides[5] = (
      <Aux>
        <h1 className={classes.SlideTitle}>Session Information</h1>
        <span>
          There are three UI elements which provide useful information about the
          session.
        </span>
        <div className={classes.sessionCardContainer}>
          <div className={classes.NameCard}>
            <img
              src={studentIcon}
              alt="black student hat"
              className={classes.StudentUserIcon}
            />
            <span>James Bond</span>
          </div>
          <span>
            This card will appear when you have connected with a student on the
            center top of your screen. It shows the student's name.
          </span>
          <div className={classes.NameCard}>
            <div className={classes.SessionInfo}>
              <div>
                <img
                  src={userIcon}
                  className={classes.PersonIcon}
                  alt="person siluethe icon"
                />
                <span> 23</span>
              </div>
              <span>07:30</span>
            </div>
          </div>
          <span>
            This indicates the session duration with the current student (in
            minutes). It also shows how many students are currently awaiting in
            queue for your company. This will be in the bottom left corner.
          </span>
        </div>
        <button onClick={this.nextSlide} className={classes.ControlButtonNext}>
          Next
        </button>
        <button onClick={this.prevSlide} className={classes.ControlButtonPrev}>
          Previous
        </button>
      </Aux>
    );

    slides[6] = (
      <Aux>
        <h1 className={classes.SlideTitle}>Alerts</h1>

        <img src={errorIcon} className={classes.ErrorIcon} />
        <span className={classes.TextChatLabel}>
          Whenever the student disconnects for a period of time, we will send
          you an alert. <br />
          In some cases, students might've only temporarily lost connection or{" "}
          <br />
          accidently closed the tab, so they can still reconnect. However if you
          wish to disconnect them permanently, <br />
          you can use the disconnect button and move onto a new session.
        </span>

        <button onClick={this.nextSlide} className={classes.ControlButtonNext}>
          Next
        </button>
        <button onClick={this.prevSlide} className={classes.ControlButtonPrev}>
          Previous
        </button>
      </Aux>
    );

    slides[7] = (
      <Aux>
        <h1 className={classes.SlideTitle}>Have fun!</h1>

        <span className={classes.TextChatLabel}>
          Connecting you with talent since 2020.
        </span>
        <img src={DigifairLogo} className={classes.DigifairLogo} />
        <span className={classes.TextChatLabel}>
          Brought to you by PeterED G., Michael S. and Jiaru L. from Big Commit
          Labs.
        </span>
        <button onClick={this.prevSlide} className={classes.ControlButtonPrev}>
          Previous
        </button>
        <button
          onClick={this.finishTutorial}
          className={classes.ControlButtonNext}
        >
          Finish Tutorial
        </button>
      </Aux>
    );

    return (
      <Modal show={this.props.showTutorialSlider}>
        <div className={classes.SliderContainer}>
          <span className={classes.SlideCounter}>
            {this.state.currentSlider + 1}/8
          </span>
          {slides[this.state.currentSlider]}
        </div>
      </Modal>
    );
  }
}
export default RecruiterSlider;
