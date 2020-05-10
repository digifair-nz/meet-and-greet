import React, { Component } from "react";

// Higher Order Components
import Aux from "../../hoc/Auxiliary";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

// Components
import CompanyCard from "../../components/StudentDashbaord/CompanyCard/CompanyCard";
import Modal from "../../components/UI/Modal/Modal";
import CompanyDescription from "../../components/CompanyDescription/CompanyDescription";
import ReadyCheckPrompt from "../../components/ReadyCheckPrompt/ReadyCheckPrompt";
// CSS
import classes from "./StudentDashboard.module.css";

//Redux
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

import axios from "../../axios-orders";

import sendNotification from "../../components/Notification/Notification";

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
    showInfoPopup: false,
    infoPopUpIndex: 0, // default, not used
    readyCompanyIndex: 0, // company ready to chat
    showReadyPromptPopUp: false,
  };

  // Set default tab title on mounting

  // Get push notifications here
  // Change back to default

  componentDidMount() {
    this.props.fetchCompanies();
    document.title = "Dashboard";

    // // Notification
    let notificationGranted;
    Notification.requestPermission().then(function (result) {
      notificationGranted = result;
    });

    // Maybe if they click on the notification it treats it as accept?

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
    // }, 5000);
  }

  // If the student declines the queue he will be ejected from the queue and close the pop up
  onDeclineHandler = () => {
    this.props.dequeueFromComapany(this.state.readyCompanyIndex);
    document.title = "Dashboard";
    this.setState({
      showReadyPromptPopUp: false,
    });
  };

  queueToCompanyHandler = (companyId) => {
    this.props.queueToCompany(companyId);
  };

  onClickModal = () => {
    this.setState({
      showInfoPopup: false,
    });
  };
  showInfoPopup = (event, companyId) => {
    event.stopPropagation();

    this.setState({
      showInfoPopup: true,
      infoPopUpIndex: companyId,
    });
  };
  // Fetch companies logic and spinner
  render() {
    let companyCards = this.props.companies.map((company, index) => {
      return (
        <CompanyCard
          companyId={index}
          isQueued={company.isQueued}
          companyLogo={company.companyLogo}
          key={company.companyId}
          hadSession={company.hadSession}
          queuePosition={this.state.q[index]}
          onInfoClick={(event) => this.showInfoPopup(event, index)}
          queuing={company.queuing}
        />
      );
    });
    return (
      <Aux>
        <div className={classes.CompanyCardContainer}>{companyCards}</div>
        {/* Company Information Pop up*/}
        <Modal modalClosed={this.onClickModal} show={this.state.showInfoPopup}>
          <CompanyDescription
            description={
              this.props.companies[this.state.infoPopUpIndex].companyDescription
            }
            logo={this.props.companies[this.state.infoPopUpIndex].companyLogo}
            closeModal={this.onClickModal}
          />
        </Modal>
        {/* Queue ready prompt Pop up*/}
        <Modal show={this.state.showReadyPromptPopUp}>
          <ReadyCheckPrompt
            logo={
              this.props.companies[this.state.readyCompanyIndex].companyLogo
            }
            companyId={this.state.readyCompanyIndex}
            onClick={this.onClickModal}
            onDeclineHandler={this.onDeclineHandler}
          />
        </Modal>
      </Aux>
    );
  }
}

// Redux
const mapStateToProps = (state) => {
  return {
    companies: state.companies,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCompanies: () => dispatch(actions.fetchCompanies()),
    dequeueFromComapany: (companyId) =>
      dispatch(actions.dequeueStudent(companyId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(StudentDashboard, axios));
