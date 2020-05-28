import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import axios from "../../axios-orders";

// Higher Order Components
import Aux from "../../hoc/Auxiliary";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

// Components
import Button from "../../components/UI/Button/Button";
import CompanyCard from "../../components/CompanyCard/CompanyCard";
import Modal from "../../components/UI/Modal/Modal";
import ReadyCheckPrompt from "../../components/ReadyCheckPrompt/ReadyCheckPrompt";
import sendNotification from "../../components/Notification/Notification";
import Spinner from "../../components/UI/Spinner/Spinner";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";

// import logoutIcon from "../../assets/icons/logout.png";
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


  Author: Michael Shaimerden (michael@tadesign.co.nz)  May - 2020
  */

  state = {
    q: [12, 13, 5, 3, 5],

    readyCompanyIndex: null, // company ready to chat
    showReadyPromptPopUp: false,
  };

  // Set default tab title on mounting

  // Get push notifications here
  // Change back to default

  componentDidMount() {
    // Notification for ready check
    let notificationGranted;
    Notification.requestPermission().then(function (result) {
      notificationGranted = result;
    });

    this.props.fetchCompanies();

    console.log("[STUDENT DASHBOARD] Mounted");

    document.title = "Dashboard";

    // Open a socket connection
    // This page is only accessible to authenticated users but double check before making a connection
    if (this.props.token !== null) {
      const ws = new WebSocket(
        "ws://localhost:3000/?token=" + this.props.token
      );
      // console.log(ws);

      // console.log("Socket Connection Opened!");
      ws.onmessage = (message) => {
        // dispatch update queue position
        const packet = JSON.parse(message.data);
        if (this.props.companies !== null && packet.companyId !== null) {
          // console.log(packet.companyId);

          // Once the student reaches his turn
          if (packet.queuePosition === 1) {
            // Find the company that is ready to chat and set the pop up
            for (let i = 0; i < this.props.companies.length; i++) {
              if (this.props.companies[i]._id === packet.companyId) {
                this.setState({
                  readyCompanyIndex: i,
                  showReadyPromptPopUp: true,
                });
                // ****READY POP UP*****
                if (notificationGranted) {
                  // Notification
                  const title = "Your Queue is Ready!";
                  const body =
                    "Google is ready for you. Accept or decline your queue";
                  sendNotification(title, body);
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

        console.log(message);
      };
    }

    // Notification
    // let notificationGranted;
    // Notification.requestPermission().then(function (result) {
    //   notificationGranted = result;
    // });

    // // Maybe if they click on the notification it treats it as accept?

    // // ****READY POP UP*****
    // setTimeout(() => {
    //   if (notificationGranted) {
    //     // Notification
    //     const title = "Your Queue is Ready!";
    //     const body = "Google is ready for you. Accept or decline your queue";
    //     sendNotification(title, body);
    //   }
    //   this.setState({
    //     showReadyPromptPopUp: true,
    //   });
    // }, 10000);
    // Company cards
  }

  // If the student declines the queue he will be ejected from the queue and close the pop up
  onDeclineHandler = () => {
    document.title = "Dashboard"; // Change back from notification tab name
    this.setState({
      showReadyPromptPopUp: false,
    });
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
        // console.log(company);
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
          />
        );
      });
      if (this.state.readyCompanyIndex !== null) {
        readyCheckPopUp = (
          <Aux>
            <Modal show={this.state.showReadyPromptPopUp}>
              <ReadyCheckPrompt
                logo={
                  this.props.companies[this.state.readyCompanyIndex].logoURL
                }
                companyId={
                  this.props.companies[this.state.readyCompanyIndex]._id
                }
                onClick={this.onClickModal}
                onDeclineHandler={this.onDeclineHandler}
                index={this.state.readyCompanyIndex}
              />
            </Modal>
          </Aux>
        );
      }
    }

    if (this.props.error) {
      companyCards = (
        <h1 className={classes.ErrorMessage}>{this.props.error}</h1>
      );
    }
    return (
      <Aux>
        <Toolbar
          isAuth={true}
          drawerToggleClicked={false}
          controlsLocation="StudentDashboard"
        >
          <Button btnType="Control">Queue All</Button>
          <Button btnType="Control">Dequeue All</Button>
          <Button iconType="Logout" btnType="Logout">
            Logout
          </Button>
        </Toolbar>

        <div className={classes.Event}>
          {/* <h1 className={classes.EventTitle}>CV Clinic July 2020</h1>
          <h1 className={classes.EventTime}>Event Timer : Live Participants</h1> */}
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
    token: state.student.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCompanies: () => dispatch(actions.fetchCompanies()),
    updateQueuePosition: (companyId, queuePosition) =>
      dispatch(actions.updateQueuePosition(companyId, queuePosition)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(StudentDashboard, axios));
