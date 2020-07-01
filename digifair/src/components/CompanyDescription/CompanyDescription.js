import React, { Component } from "react";

import classes from "./CompanyDescription.module.css";

import closeIcon from "../../assets/icons/cross.png";

// Make into class?
class CompanyDescription extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    // The only time company description needs to update
    // is when it is meant to be showed
    return nextProps.show !== this.props.show;
  }

  render() {
    //console.log("COMPANY DESCRIPTION");
    return (
      <div
        onClick={this.props.closeModal}
        className={classes.DescriptionContainer}
      >
        <img className={classes.CloseIcon} src={closeIcon} alt="Close button" />
        {/* <img
          alt="Company logo"
          className={classes.Logo}
          src={this.props.logo}
        /> */}
        <span className={classes.Logo}>{this.props.name}</span>
        <div className={classes.DescriptionText}>{this.props.description}</div>
      </div>
    );
  }
}

export default CompanyDescription;
