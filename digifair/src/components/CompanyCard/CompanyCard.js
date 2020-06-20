import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

import informationIcon from "../../assets/icons/information-circle.png";
import userIcon from "../../assets/icons/person.png";

import Spinner from "../UI/Spinner/Spinner";
import Modal from "../UI/Modal/Modal";
import Aux from "../../hoc/Auxiliary";
import CompanyDescription from "../CompanyDescription/CompanyDescription";

import classes from "./CompanyCard.module.css";

class CompanyCard extends Component {
  /*

  Company card that will be rendered on event dashboards (such as StudentDashboard)

  Exepects:    1. Company Logo image path string (companyLogo)
               2. Student Queue status(isQueued)
               3. Student had a session (hadSession)
               4. Student's position in queue (queuePosition)

  Dispatches an action to queue or dequeue users if they did not have a session yet

  Also triggers a pop up to show company logo and description to provide some quick information 


    Author: Michael Shaimerden (michael@tadesign.co.nz)
  */

  state = {
    showInfoPopup: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.queuing !== this.props.queuing ||
      nextProps.logo !== this.props.logo ||
      nextProps.isQueued !== this.props.isQueued ||
      nextState.showInfoPopup !== this.state.showInfoPopup ||
      nextProps.queuePosition !== this.props.queuePosition ||
      nextProps.hadSession !== this.props.hadSession
      // || nextProps.tempDisabled !== this.props.tempDisabled
    );
  }

  onCardClick = () => {
    // Prevent multiple queue requests
    // console.log("Company card is queued: " + this.props.isQueued);
    if (!this.props.hadSession && !this.props.isQueued && !this.props.queuing) {
      this.props.queueToCompany(this.props.id, this.props.index);
    } else if (this.props.isQueued && !this.props.queuing) {
      this.props.dequeueFromComapany(this.props.id, this.props.index);
    } else if (this.props.queuing) {
    } else {
      alert("You already had a session with this company");
    }
  };

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
    console.log(this.props.hadSession);
    // If the student has talked to a recruiter from this company, disable queuing ability
    let currentClass = classes.CompanyCard;
    // console.log(
    //   "[COMPANY CARD] render: " + this.props.id + " " + this.state.showInfoPopup
    // );

    // Activate the glow when the person is queued or disable if the person had session
    if (this.props.isQueued) {
      currentClass = classes.CompanyCardActive;
    } else if (this.props.hadSession) {
      currentClass = classes.CompanyCardDisabled;
    }

    // Status circle (green if unqueued and red if not allowed to queue)
    let statusCircle = classes.StatusCircle; // Green by default

    if (this.props.hadSession) {
      statusCircle += " " + classes.RedCircle; // Change to red if the user had a session
    }

    let logoDisplay = "block"; // While the user is sending the request, hide the logo to show the spinner.
    if (this.props.queuing | (this.props.logo == null)) {
      logoDisplay = "none";
    }
    return (
      // 4 main visual elements
      <Aux>
        <Modal modalClosed={this.onClickModal} show={this.state.showInfoPopup}>
          <CompanyDescription
            show={this.state.showInfoPopup}
            description={this.props.description}
            logo={this.props.logo}
            closeModal={this.onClickModal}
          />
        </Modal>

        <div onClick={this.onCardClick} className={currentClass}>
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
            {this.props.isQueued ? (
              <div className={classes.QueueStatus}>
                <img
                  alt="Black User icon"
                  className={classes.UserIcon}
                  src={userIcon}
                />
                <span className={classes.QueuePosition}>
                  {this.props.queuePosition}
                </span>
              </div>
            ) : (
              <div className={statusCircle}></div>
            )}
            {/* Green circle indicates that student can queue while Red circle means he can't */}
          </div>

          {/* Show a spinner instead of the company logo to indicate queue request */}

          {
            this.props.queuing | (this.props.logo == null) ? (
              <Spinner />
            ) : null /* Show the spinner while the use sends a queue/dequeue request */
          }
          <img
            src={this.props.logo}
            className={classes.CompanyLogo}
            style={{ display: logoDisplay }}
            alt="Company Logo"
          />
        </div>
      </Aux>
    );
  }
}

// Prop types
CompanyCard.propTypes = {
  companyLogo: PropTypes.string,
  isQueued: PropTypes.bool,
  hadSession: PropTypes.bool,
  companyId: PropTypes.number,
  description: PropTypes.string,
};

const mapDispatchToProps = (dispatch) => {
  return {
    queueToCompany: (companyId, index) =>
      dispatch(actions.queueStudent(companyId, index)),
    dequeueFromComapany: (companyId, index) =>
      dispatch(actions.dequeueStudent(companyId, index)),
  };
};

export default connect(null, mapDispatchToProps)(CompanyCard);
