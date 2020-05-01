import React from "react";

import classes from "./CompanyCard.module.css";
const companyCard = (props) => {
  
  return (
    <div
      onClick={props.onClick}
      className={
        !props.isQueued ? classes.CompanyCard : classes.CompanyCardActive
      }
    >
      <img src={props.src} alt={props.alt} className={classes.CompanyLogo} />
    </div>
  );
};
export default companyCard;
