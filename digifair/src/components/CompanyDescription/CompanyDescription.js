import React from "react";

import classes from "./CompanyDescription.module.css";

import closeIcon from "../../assets/icons/cross.png";
const companyDescription = (props) => {
  return (
    <div className={classes.DescriptionContainer}>
      <img
        onClick={props.closeModal}
        className={classes.CloseIcon}
        src={closeIcon}
        alt="Close button"
      />
      <img alt="Company logo" className={classes.Logo} src={props.logo} />
      <div className={classes.DescriptionText}>{props.description}</div>
    </div>
  );
};
export default companyDescription;
