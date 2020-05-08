import React, { Component } from "react";
import PropTypes from "prop-types";

import classes from "./CompanyCard.module.css";

import informationIcon from "../../../assets/icons/information-circle.png";
import userIcon from "../../../assets/icons/person.png";

import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";

class CompanyCard extends Component {
  /*

  Company card that will be rendered on event dashboards (such as StudentDashboard)

  Exepects:    1. Company Logo image path string (companyLogo)
               2. Student Queue status(isQueued)
               3. Student had a session (hadSession)
               4. Student's position in queue (queuePosition)

  Dispatches an action to queue

  */
  // shouldComponentUpdate(nextProps, nextState) {
  //   return (
  //     nextProps.show !== this.props.show ||
  //     nextProps.children !== this.props.children
  //   );
  // }
  onCardClick = () => {
    if (!this.props.hadSession) {
      this.props.queueToCompany(this.props.companyId);
    } else {
      alert("You already had a session with this company");
    }
  };
  render() {
    // If the student has talked to a recruiter from this company, disable queuing ability

    //
    let disabledOpacity = 1;

    if (this.props.hadSession) {
      disabledOpacity = 0.4;
    }
    let currentClass = classes.CompanyCard;

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
          <img className={classes.InfoIcon} src={informationIcon} />

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
        </div>
        <img
          src={this.props.companyLogo}
          alt={this.props.alt}
          className={classes.CompanyLogo}
        />
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
  };
};

export default connect(null, mapDispatchToProps)(CompanyCard);
