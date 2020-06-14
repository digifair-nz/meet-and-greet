import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

// Higher Order Components
import Aux from "../../hoc/Auxiliary";

// Components
import Button from "../../components/UI/Button/Button";
import CompanyCard from "../../components/CompanyCard/CompanyCard";
import ErrorPopup from "../../components/ErrorPopup/ErrorPopup";
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

  */

  state = {
    readyCompanyIndex: null, // company ready to chat
    showReadyPromptPopUp: false,
    permissionGranted: false,
  };

  // Set default tab title on mounting

  // Get push notifications here
  // Change back to default

  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextProps.token != this.props.token;
  // }

  componentDidMount() {
    console.log("[STUDENT DASHBOARD] Mounted");

    // Notification for mic and camera permission for the chatroom
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(function (stream) {
        stream.getTracks().forEach((track) => {
          // Stop streaming after permission is granted

          track.stop();
        });
      })
      .catch(function (err) {
        console.log(err);
        alert(
          "You need to grant microphone and camera permission for the interview if you want to participate."
        );
      });

    // Make sure the user has given permission for microphone and camera
    navigator.permissions.query({ name: "camera" }).then((permissionStatus) => {
      switch (permissionStatus.state) {
        case "denied":
          //console.log("denied");
          this.setState({
            permissionGranted: false,
          });
          break;
        case "granted":
          this.setState({
            permissionGranted: true,
          });
          break;
        case "prompt":
        //console.log("waiting...");
        default:
        //console.log("Internal error");
      }
      permissionStatus.onchange = (e) => {
        // detecting if the event is a change
        if (e.type === "change") {
          // checking what the new permissionStatus state is
          const newState = e.target.state;
          if (newState === "denied") {
            this.setState({
              permissionGranted: false,
            });
          } else if (newState === "granted") {
            this.setState({
              permissionGranted: true,
            });
          } else {
            console.log("Thanks for reverting things back to normal");
          }
        }
      };
    });

    // Make sure the user has given permission for microphone and camera
    navigator.permissions
      .query({ name: "microphone" })
      .then((permissionStatus) => {
        switch (permissionStatus.state) {
          case "denied":
            console.log("denied");
            this.setState({
              permissionGranted: false,
            });
            break;
          case "granted":
            this.setState({
              permissionGranted: true,
            });
            break;
          case "prompt":
            console.log("waiting...");
        }
        permissionStatus.onchange = (e) => {
          // detecting if the event is a change
          if (e.type === "change") {
            // checking what the new permissionStatus state is
            const newState = e.target.state;
            if (newState === "denied") {
              this.setState({
                permissionGranted: false,
              });
            } else if (newState === "granted") {
              this.setState({
                permissionGranted: true,
              });
            } else {
              console.log("Thanks for reverting things back to normal");
            }
          }
        };
      });

    // Notification for ready check
    let notificationGranted;
    Notification.requestPermission().then(function (result) {
      notificationGranted = result;
    });

    this.props.fetchCompanies();

    //console.log("[STUDENT DASHBOARD] Mounted");

    document.title = "Dashboard";

    // Open a socket connection
    // This page is only accessible to authenticated users but double check before making a connection
    if (this.props.token !== null) {
      var ws = new WebSocket(
        // "ws://localhost:3000/?token=" + this.props.token
        "wss://digifair-test.herokuapp.com/?token=" + this.props.token
      );

      // console.log("Socket Connection Opened!");
      ws.onmessage = (message) => {
        // dispatch update queue position
        console.log(message);
        const packet = JSON.parse(message.data);
        //console.log(packet.messageType);
        if (this.props.companies !== null && packet.companyId !== null) {
          // console.log(packet.companyId);

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

        //console.log(message);
      };
    }
  }

  // If the student declines the queue he will be ejected from the queue and close the pop up
  onDeclineHandler = () => {
    document.title = "Dashboard"; // Change back from notification tab name

    //Temporarily disable the company he declined.

    this.setState({
      showReadyPromptPopUp: false,
      readyCompanyIndex: null,
    });
  };

  errorConfirmedHandler = () => {
    this.props.clearError();
  };
  // Fetch companies logic and spinner
  render() {
    let companyCards;
    let readyCheckPopUp;
    if (!this.props.companies) {
      companyCards = <Spinner />;
      readyCheckPopUp = null;
    } else {
      if (!this.state.permissionGranted) {
        companyCards = (
          <span
            style={{ textAlign: "center", gridColumnStart: 2, color: "red" }}
          >
            Please give permission for camera and microphone to participate in
            the event
          </span>
        );
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
      }

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
                //onClick={this.onClickModal}
                onDeclineHandler={this.onDeclineHandler}
                index={this.state.readyCompanyIndex}
              />
            </Modal>
          </Aux>
        );
      }
    }

    return (
      <Aux>
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
          <Button btnType="Control">Queue All</Button>
          <Button btnType="Control">Dequeue All</Button>
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
    token: state.user.token,
    credentials: state.user.credentials,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCompanies: () => dispatch(actions.fetchCompanies()),
    updateQueuePosition: (companyId, queuePosition) =>
      dispatch(actions.updateQueuePosition(companyId, queuePosition)),
    logout: () => dispatch(actions.logout()),
    clearError: () => dispatch(actions.clearError()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentDashboard);
