import React, { Component } from "react";
import PropTypes from "prop-types";

import classes from "./CompanyCard.module.css";

import informationIcon from "../../../assets/icons/information-circle.png";
import userIcon from "../../../assets/icons/person.png";

import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";

import Spinner from "../../UI/Spinner/Spinner";



class CompanyCard extends Component {
  /*

  Company card that will be rendered on event dashboards (such as StudentDashboard)

  Exepects:    1. Company Logo image path string (companyLogo)
               2. Student Queue status(isQueued)
               3. Student had a session (hadSession)
               4. Student's position in queue (queuePosition)

  Dispatches an action to queue

  */
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.queuing !== this.props.queuing;
    // Also update if the queue status has changed.
  }
  onCardClick = () => {
    // Prevent multiple queue requests

    if (!this.props.hadSession && !this.props.isQueued) {
      this.props.queueToCompany(this.props.companyId);
    } else if (this.props.isQueued) {
      this.props.dequeueFromComapany(this.props.companyId);
    } else {
      alert("You already had a session with this company");
    }
  };
  render() {
    // If the student has talked to a recruiter from this company, disable queuing ability
    let currentClass = classes.CompanyCard;
    console.log("[COMPANY CARD] render: " + this.props.companyId);
    if (this.props.isQueued) {
      currentClass = classes.CompanyCardActive;
    } else if (this.props.hadSession) {
      currentClass = classes.CompanyCardDisabled;
    }

    return (
      // 4 main visual elements

      <div onClick={this.onCardClick} className={currentClass}>
        {/* Card header contains information icon (prompts company description info) and queue status */}

        <div className={classes.CardHeader}>
          <img
            onClick={this.props.onInfoClick}
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
              <img className={classes.userIcon} src={userIcon} />
              <span className={classes.QueuePosition}>
                {this.props.queuePosition}
              </span>
            </div>
          ) : (
            <div
              className={
                !this.props.hadSession ? classes.GreenCircle : classes.RedCircle
              }
            ></div>
          )}
          {/* Green circle indicates that student can queue while Red circle means he can't */}
        </div>

        {/* Show a spinner instead of the company logo to indicate queue request */}
        {/* {this.props.loading && this.state.clicked && !this.props.isQueued ?  */}
        {this.props.queuing ? (
          <Spinner />
        ) : (
          <img
            src={this.props.companyLogo}
            alt={this.props.alt}
            className={classes.CompanyLogo}
            alt="Company Logo"
          />
        )}
      </div>
    );
  }
}

// Prop types
CompanyCard.propTypes = {
  companyLogo: PropTypes.string,
  isQueued: PropTypes.bool,
  hadSession: PropTypes.bool,
  companyId: PropTypes.number,
};

const mapDispatchToProps = (dispatch) => {
  return {
    queueToCompany: (companyId) => dispatch(actions.queueStudent(companyId)),
    dequeueFromComapany: (companyId) =>
      dispatch(actions.dequeueStudent(companyId)),
  };
};

export default connect(null, mapDispatchToProps)(CompanyCard);
