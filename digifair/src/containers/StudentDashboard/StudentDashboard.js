import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

// Higher Order Components
import Aux from "../../hoc/Auxiliary";

// Components
import Button from "../../components/UI/Button/Button";
import CompanyCard from "../../components/CompanyCard/CompanyCard";
import ErrorPopup from "../../components/ErrorPopup/ErrorPopup";
import EventTimer from "../../components/EventTimer/EventTimer";
import Modal from "../../components/UI/Modal/Modal";
import ReadyCheckPrompt from "../../components/ReadyCheckPrompt/ReadyCheckPrompt";

import Spinner from "../../components/UI/Spinner/Spinner";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import StudentTutorial from "../../components/TutorialSlider/StudentTutorial/StudentTutorial";
import digifairLogo from "../../assets/company_logos/digifair_icon_notification.png";
import notificationSound from "../../assets/audio/anxious.mp3";

// CSS
import classes from "./StudentDashboard.module.css";

//Redux

class StudentDashboard extends Component {
  /*
  The dashboard students will see during the event. The dasboard will contain company cards which will represent
  different companies that are participating during the event.

  This dashboard reaches out to the store (which fetches company data from the server) and populates the container
  with CompanyCard component.

  It also manages the queue status by dispatching actions 

  */

  state = {
    readyCompanyIndex: null, // company ready to chat
    showReadyPromptPopUp: false,
    //permissionGranted: true,
    isQueuedToAll: false,
    buttonClicked: false,
    showTutorial: true,
  };

  // Set default tab title on mounting

  // Get push notifications here
  // Change back to default

  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextProps.token != this.props.token;
  // }

  componentDidMount() {
    const audio = new Audio(notificationSound);

    // Tutorial

    if (localStorage.getItem("seenTutorial")) {
      this.setState({
        showTutorial: false,
      });
    }

    if (this.props.isStudent) {
      this.props.fetchCompanies();

      document.title = "Dashboard";

      // Notification for ready check
      let notificationGranted;
      if (typeof Notification !== "undefined") {
        Notification.requestPermission().then(function (result) {
          notificationGranted = result;
        });
      } else {
        notificationGranted = true;
      }

      // Open a socket connection
      // This page is only accessible to authenticated users but double check before making a connection
      if (this.props.token !== null) {
        // Check that we haven't connected to the socket before

        var ws = new WebSocket(
          // "wss://digifair-test.herokuapp.com/?token=" + this.props.token
          // "ws://localhost:3000/?token=" + this.props.token
          "wss://www.digifair.app/?token=" + this.props.token
        );

        setInterval(() => {
          ws.send(
            JSON.stringify({
              messageType: "ping",
            })
          );
        }, 30000);

        ws.onmessage = (message) => {
          // dispatch update queue position

          const packet = JSON.parse(message.data);

          if (this.props.companies !== null && packet.companyId !== null) {
            // Once the student reaches his turn
            if (packet.messageType === "ready") {
              // Find the company that is ready to chat and set the pop up
              for (let i = 0; i < this.props.companies.length; i++) {
                if (this.props.companies[i]._id === packet.companyId) {
                  this.setState({
                    readyCompanyIndex: i,
                    showReadyPromptPopUp: true,
                  });
                  // Wait 10 seconds before closing the pop up.

                  // ****READY POP UP*****
                  if (notificationGranted) {
                    // Notification
                    const title = "Your Queue is Ready!";
                    const body =
                      "Google is ready for you. Accept or decline your queue";
                    //sendNotification(title, body);

                    let notification = new Notification(title, {
                      body: body,
                      icon: digifairLogo,
                    });

                    audio.play();

                    notification.onclick = () => {
                      document.title = "Dashboard";
                      window.focus(); // Redirects to the window
                    };
                    document.title = "Digifair (1)";
                  }

                  break;
                }
              }
            } else {
              // Otherwise update queue position for the specific company
              this.props.updateQueuePosition(
                packet.companyId,
                packet.queuePosition
              );
            }
          }
        };
      }
    }
  }

  showTutorial = () => {
    this.setState({
      showTutorial: true,
    });
  };
  closeTutorial = () => {
    localStorage.setItem("seenTutorial", true);
    this.setState({
      showTutorial: false,
    });
  };
  // If the student declines the queue he will be ejected from the queue and close the pop up
  onDeclineHandler = () => {
    document.title = "Dashboard"; // Change back from notification tab name

    //Temporarily disable the company he declined.

    this.setState({
      showReadyPromptPopUp: false,
      readyCompanyIndex: null,
    });
  };

  // onAcceptHandler = () => {
  //   //document.title = "Dashboard"; // Change back from notification tab name

  //   //Temporarily disable the company he declined.

  //   this.setState({
  //     showReadyPromptPopUp: false,
  //     readyCompanyIndex: null,
  //   });
  // };

  errorConfirmedHandler = () => {
    this.props.clearError();
  };

  dequeueFromAll = () => {
    let flag = false;
    //Check if the student has eligible companies to dequeue from
    for (let i = 0; i < this.props.companies.length; i++) {
      if (
        this.props.companies[i].isQueued &&
        !this.props.companies[i].hadSession
      ) {
        flag = true;
      }
    }

    if (flag) {
      this.setState({
        isQueuedToAll: false,
      });
      this.props.dequeueFromAll();
    }
  };

  queueToAll = () => {
    let flag = false;
    //Check if the student has eligible companies to queue for
    for (let i = 0; i < this.props.companies.length; i++) {
      if (
        !this.props.companies[i].isQueued &&
        !this.props.companies[i].hadSession
      ) {
        flag = true;
      }
    }

    if (flag && !this.state.isQueuedToAll) {
      this.setState({
        isQueuedToAll: true,
      });
      this.props.queueToAll();
    }
  };

  // Fetch companies logic and spinner
  render() {
    let companyCards;
    let readyCheckPopUp;
    if (!this.props.companies) {
      companyCards = <Spinner />;
      readyCheckPopUp = null;
    } else {
      companyCards = this.props.companies.map((company, index) => {
        return (
          <CompanyCard
            id={company._id}
            index={index}
            isQueued={company.isQueued}
            logo={company.logoURL}
            key={company._id}
            hadSession={company.hadSession}
            queuePosition={company.queuePosition}
            onInfoClick={(event) => this.showInfoPopup(event, index)}
            queuing={company.queuing}
            description={company.description}
            name={company.name}
          />
        );
      });
    }

    if (this.state.readyCompanyIndex !== null) {
      readyCheckPopUp = (
        <Aux>
          <Modal show={this.state.showReadyPromptPopUp}>
            <ReadyCheckPrompt
              logo={this.props.companies[this.state.readyCompanyIndex].logoURL}
              companyId={this.props.companies[this.state.readyCompanyIndex]._id}
              companyName={
                this.props.companies[this.state.readyCompanyIndex].name
              }
              //onClick={this.onClickModal}
              onDeclineHandler={this.onDeclineHandler}
              // onAcceptHandler={this.onAcceptHandler}
              index={this.state.readyCompanyIndex}
            />
          </Modal>
        </Aux>
      );
    }

    return (
      <Aux>
        <StudentTutorial
          className={classes.Tutorial}
          closeTutorial={this.closeTutorial}
          showTutorialSlider={this.state.showTutorial}
        />
        <ErrorPopup
          show={this.props.error}
          modalClosed={this.errorConfirmedHandler}
          error={this.props.error}
        />
        <Toolbar
          isAuth={true}
          drawerToggleClicked={false}
          controlsLocation="StudentDashboard"
        >
          <Button btnType="Control" clicked={this.showTutorial}>
            Tutorial
          </Button>
          <Button
            disabled={this.state.isQueuedToAll}
            btnType="Control"
            clicked={this.queueToAll}
          >
            Queue All
          </Button>
          <Button clicked={this.dequeueFromAll} btnType="Control">
            Dequeue All
          </Button>
          <Button
            clicked={this.props.logout}
            iconType="Logout"
            btnType="Logout"
          >
            Logout
          </Button>
        </Toolbar>

        <div className={classes.Event}>
          <div className={classes.BackgroundMask}></div>
          <h1 className={classes.EventTitle}>{this.props.event.eventName}</h1>
          <h1 className={classes.EventTime}>
            <EventTimer eventExpiration={this.props.event.eventExpiration} />
          </h1>
          <div className={classes.CompanyCardContainer}>{companyCards}</div>
        </div>
        {readyCheckPopUp}
      </Aux>
    );
  }
}

// Redux
const mapStateToProps = (state) => {
  return {
    companies: state.companies.companies,
    error: state.companies.error,
    token: state.user.token,
    credentials: state.user.credentials,
    event: state.event,
    isStudent: state.user.isStudent,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCompanies: () => dispatch(actions.fetchCompanies()),
    updateQueuePosition: (companyId, queuePosition) =>
      dispatch(actions.updateQueuePosition(companyId, queuePosition)),
    logout: () => dispatch(actions.logout()),
    clearError: () => dispatch(actions.clearError()),
    queueToAll: () => dispatch(actions.queueToAll()),
    dequeueFromAll: () => dispatch(actions.dequeueFromAll()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentDashboard);
