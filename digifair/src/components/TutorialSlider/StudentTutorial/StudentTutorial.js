import React, { Component } from "react";

import Aux from "../../../hoc/Auxiliary";
import Button from "../../UI/Button/Button";
import Modal from "../../UI/Modal/Modal";

import classes from "./StudentTutorial.module.css";

import relaxedWorker from "../../../assets/screen-images/relaxed-worker.png";
import textChatIcon from "../../../assets/icons/talkJsIcon.png";
import errorIcon from "../../../assets/icons/error.png";
import DigifairLogo from "../../../assets/company_logos/digifair-logo-black.png";
import browserPrompt from "../../../assets/screen-images/browser-prompt.png";
import studentIcon from "../../../assets/icons/black-student_hat.png";
import recruiterIcon from "../../../assets/icons/black-tie.png";
import userIcon from "../../../assets/icons/person.png";
import informationIcon from "../../../assets/icons/information-circle.png";
//import CompanyCard from "../../CompanyCard/CompanyCard";
import CompanyDescription from "../../CompanyDescription/CompanyDescription";

class RecruiterSlider extends Component {
  state = {
    currentSlider: 0,
    showInfoPopup: false,
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

  // Slide 2 - Company Card
  onClickModal = () => {
    this.setState({
      showInfoPopup: false,
    });
  };

  onInfoCircleClick = (event) => {
    event.stopPropagation();

    this.setState({
      showInfoPopup: true,
    });
  };

  render() {
    // Create company card sample
    let companyCard = (
      <Aux>
        <Modal modalClosed={this.onClickModal} show={this.state.showInfoPopup}>
          <CompanyDescription
            show={this.state.showInfoPopup}
            description={
              "Digifair is a small start up developed by three Auckland Uni students: Peter Goedeke, Michael Shaimerden and Mercury Lin. Our goal was to connect students and company recruiters digitally to help connect market with talent."
            }
            logo={DigifairLogo}
            closeModal={this.onClickModal}
          />
        </Modal>

        <div onClick={this.onCardClick} className={classes.CompanyCard}>
          {/* Card header contains information icon (prompts company description info) and queue status */}

          <div className={classes.CardHeader}>
            <img
              onClick={(event) => this.onInfoCircleClick(event)}
              className={classes.InfoIcon}
              src={informationIcon}
              alt="Information icon"
            />

            {/*
       If users are not queued, they will see a green circle indicating that they can queue to this company.
       If they have queued and are awaiting, they will see their position in the queue.
    */}

            <div className={classes.StatusCircle}></div>

            {/* Green circle indicates that student can queue while Red circle means he can't */}
          </div>

          <img
            src={DigifairLogo}
            className={classes.CompanyLogo}
            alt="Company Logo"
          />
        </div>
      </Aux>
    );

    let slides = [];

    slides[0] = (
      <Aux>
        <h1 className={classes.WelcomeMessage}>Welcome to DIGIFAIR</h1>
        <div className={classes.SlideContent}>
          <span>
            This short tutorial will walk you through all of the features of this
            application.
          </span>
          <br />
          
          <img
            src={relaxedWorker}
            alt="Digital worker on a hammock with a computer and a plant"
            className={classes.RelaxedWorkerImage}
          />
        </div>
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
        <h1 className={classes.SlideTitle}>Queuing and Dequeuing</h1>

        <div className={classes.SlideContent}>

          <span>
            You can queue for a specific company by clicking on the company card
          in the dashboard. Once queued, simply click again if you wish
          to dequeue.
          </span>
        
          <div className={classes.DigifairCompanyCard}>{companyCard}</div>
          <div className={classes.TextContainer}>
            <div className={classes.IconText}>
              <div className={classes.GreenCircle}></div>
              <span>
                Green circle means you are eligible to queue. 
            </span>
            </div>
            <div className={classes.IconText}>
              <img
                className={classes.SliderInfoIcon}
                src={informationIcon}
                alt="Information icon"
              />
              <span>
                Presents additional information on the company. 
            </span>
            </div>

            <div className={classes.IconText}>
              <img
                alt="Black User icon"
                className={classes.SliderInfoIcon}
                src={userIcon}
              />
              <span>
                Queueing replaces green circle with your position in queue. 
            </span>
            </div>
          </div>
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
        <h1 className={classes.SlideTitle}>Control Buttons</h1>
        <div className={classes.SlideContent}>

          <span>
            Control buttons are found in the toolbar menu on your left (click on
            the hamburger).
          </span>
            <span>
              You can also display this tutorial again and logout when you have
              finished the event.
          </span>
          <div className={classes.ButtonContainer}>
            <button
              style={{ backgroundColor: "#0056FF", color: "white" }}
              className={classes.Button}
            >
              Queue All
          </button>

            <span className={classes.ButtonText}>
              You can queue and dequeue from all companies simultaneously.
          </span>
            <button
              style={{ backgroundColor: "##bf3b33", color: "white" }}
              className={classes.Button}
            >
              Disconnect
          </button>

            <span className={classes.ButtonText}>
              Once you are in a session with the recruiter, this button will be
              available to you for disconnecting from the session and come back
              the main event dashboard.
            <strong>
                However it is advised that you allow recruiter to disconnect you.
            </strong>
            </span>
          </div>
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
        <h1 className={classes.SlideTitle}>Ready Check</h1>
        <div className={classes.SlideContent}>

          <span className={classes.TextChatLabel}>
            Once it is your turn, you must accept or decline the company's
          invitation. <br />
            <strong>You will have 10 seconds to do so.</strong>
            <br />
            <strong style={{ color: "red" }}>
              Please allow notifications as we will send you an audio and web
              alert when you need to accept your turn.
          </strong>
          </span>
          <div className={classes.ButtonContainer}>
            <button
              style={{
                backgroundColor: "#E2508B",
                color: "white",
                borderRadius: "30px",
              }}
              className={classes.Button}
            >
              Accept
          </button>

            <span className={classes.ButtonText}>
              Once you click on this, you will be redirected to the company room
            where you will see the recruiter.{" "}
              <strong style={{ color: "red" }}>
                If it will be your first time, make sure you allow usage of your
                webcam and microphone if you have those otherwise you will not
                connect!
            </strong>
            </span>
            <button
              style={{
                backgroundColor: "#0056FF",
                color: "white",
                borderRadius: "30px",
              }}
              className={classes.Button}
            >
              Decline
          </button>

            <span className={classes.ButtonText}>
              If you decline or do not accept in time, you will be removed from
              the queue and won't be able to queue again for 10 seconds.
          </span>
          </div>
        </div>
        <button onClick={this.prevSlide} className={classes.ControlButtonPrev}>
          Previous
        </button>
        <button onClick={this.nextSlide} className={classes.ControlButtonNext}>
          Next
        </button>
      </Aux>
    );

    slides[4] = (
      <Aux>
        <h1 className={classes.SlideTitle}>Allow permissions</h1>
        <div className={classes.SlideContent}>
          <span className={classes.TextChatLabel}>
            When you are about to connect to your first session, <br />
            <strong style={{ color: "red" }}>
              your browser will request access to your web camera and microphone
              once.
            </strong>
            <br />
            It is important that you allow this application to use those features
            if you have a web-camera and a microphone. <br />
            <strong style={{ color: "red" }}>
              If you won't allow, you won't be able to connect to a recruiter.
            </strong>
          </span>
          <br />
          <img src={browserPrompt} className={classes.BrowserPrompt} />
        </div>

        <button onClick={this.prevSlide} className={classes.ControlButtonPrev}>
          Previous
        </button>
        <button onClick={this.nextSlide} className={classes.ControlButtonNext}>
          Next
        </button>
      </Aux>
    );

    slides[5] = (
      <Aux>
        <h1 className={classes.SlideTitle}>Video Controls</h1>
        <div className={classes.SlideContent}>

          <div className={classes.VideoControlsContainer}>
            <div className={classes.MicIcon}></div>
            <div className={classes.CameraIcon}></div>
            <div className={classes.ScreenShareIcon}></div>
          </div>

          <span>
            Once you are in the session, you can use these buttons to <br /> <strong>Mute</strong>
            , <strong>Camera Toggle</strong>, and <strong>Screen Share</strong>.
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
        <h1 className={classes.SlideTitle}>Text Chat</h1>
        <div className={classes.SlideContent}>

          <img src={textChatIcon} className={classes.TextChatIcon} />
          <span className={classes.TextChatLabel}>
            This text bubble icon will appear when you have connected to the
            session with a recruiter.
          <br />
          You can exchange messages through this chat during the session
          duration. <br />
          Your conversation is not stored and no user can see the previous
          conversation.
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

    // Name card , session duration, students queued
    slides[7] = (
      <Aux>
        <h1 className={classes.SlideTitle}>Session Information</h1>
        <div className={classes.SlideContent}>
          <span>
            This UI elements provides useful information about the
            session.
          </span>
          <div className={classes.sessionCardContainer}>
            <div className={classes.NameCard}>
              <img
                src={recruiterIcon}
                alt="black student hat"
                className={classes.StudentUserIcon}
              />
              <span>James Bond</span>
            </div>
            <span>
              This card will appear when you have connected with a recruiter on
              the center top of your screen. It shows the recruiter's name.
            </span>
          </div>
        </div>
        <button onClick={this.nextSlide} className={classes.ControlButtonNext}>
          Next
        </button>
        <button onClick={this.prevSlide} className={classes.ControlButtonPrev}>
          Previous
        </button>
      </Aux>
    );

    slides[8] = (
      <Aux>
        <h1 className={classes.SlideTitle}>Alerts</h1>
        <div className={classes.SlideContent}>
          <img src={errorIcon} className={classes.ErrorIcon} />
          <span className={classes.TextChatLabel}>
            You may get alerts in certain scenarios such as if you have not
            accepted your turn in time.
            <br />
            Pay attention to the message if you recieve such an alert.
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

    slides[9] = (
      <Aux>
        <h1 className={classes.SlideTitle}>Have fun!</h1>
        <div className={classes.SlideContent}>
          <span className={classes.TextChatLabel}>
            Connecting you with talent since 2020.
          </span>
          <img src={DigifairLogo} className={classes.DigifairLogo} />
          <span className={classes.TextChatLabel}>
            Brought to you by Peter G., Michael S. and Mercury L. from Big Commit
            Labs.
          </span>
        </div>
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
            {this.state.currentSlider + 1}/10
          </span>
          {slides[this.state.currentSlider]}
        </div>
      </Modal>
    );
  }
}
export default RecruiterSlider;
