import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import axios from "../../axios-orders";

// Higher Order Components
import Aux from "../../hoc/Auxiliary";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

// Components
import CompanyCard from "../../components/CompanyCard/CompanyCard";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import Modal from "../../components/UI/Modal/Modal";

import ReadyCheckPrompt from "../../components/ReadyCheckPrompt/ReadyCheckPrompt";
import sendNotification from "../../components/Notification/Notification";
import Spinner from "../../components/UI/Spinner/Spinner";

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

    readyCompanyIndex: 1, // company ready to chat
    showReadyPromptPopUp: false,
  };

  // Set default tab title on mounting

  // Get push notifications here
  // Change back to default

  componentDidMount() {
    this.props.fetchCompanies();

    console.log("[STUDENT DASHBOARD] Mounted");
    document.title = "Dashboard";

    // Notification
    let notificationGranted;
    Notification.requestPermission().then(function (result) {
      notificationGranted = result;
    });

    // Maybe if they click on the notification it treats it as accept?

    // ****READY POP UP*****
    setTimeout(() => {
      if (notificationGranted) {
        // Notification
        const title = "Your Queue is Ready!";
        const body = "Google is ready for you. Accept or decline your queue";
        sendNotification(title, body);
      }
      this.setState({
        showReadyPromptPopUp: true,
      });
    }, 10000);
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
            queuePosition={this.state.q[index]}
            onInfoClick={(event) => this.showInfoPopup(event, index)}
            queuing={company.queuing}
            description={company.description}
          />
        );
      });
      readyCheckPopUp = (
        <Aux>
          <Modal show={this.state.showReadyPromptPopUp}>
            <ReadyCheckPrompt
              logo={this.props.companies[this.state.readyCompanyIndex].logoURL}
              companyId={this.props.companies[this.state.readyCompanyIndex]._id}
              onClick={this.onClickModal}
              onDeclineHandler={this.onDeclineHandler}
              index={this.state.readyCompanyIndex}
            />
          </Modal>
        </Aux>
      );
    }

    if (this.props.error) {
      companyCards = (
        <h1 className={classes.ErrorMessage}>{this.props.error}</h1>
      );
    }
    return (
      <Aux>
        <Toolbar isAuth={true} drawerToggleClicked={false}>
          <span>Queue to all</span>
          <span>Dequeue from all</span>
          <span>Hello</span>
        </Toolbar>
        <div className={classes.CompanyCardContainer}>{companyCards}</div>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCompanies: () => dispatch(actions.fetchCompanies()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(StudentDashboard, axios));
