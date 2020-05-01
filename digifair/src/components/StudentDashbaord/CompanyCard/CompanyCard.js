import React from "react";

import classes from "./CompanyCard.module.css";
const companyCard = (props) => {
  return (
    <div className={classes.CompanyCard}>
      <img src={props.src} alt={props.alt} className={classes.CompanyLogo} />
    </div>
  );
};
export default companyCard;
