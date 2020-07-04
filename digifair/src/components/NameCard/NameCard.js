import React from "react";

import Spinner from "../../components/UI/Spinner/Spinner";

import studentIcon from "../../assets/icons/black-student_hat.png";
import recruiterIcon from "../../assets/icons/black-tie.png";

import classes from "./NameCard.module.css";

const nameCard = (props) => {
  let name;

  let icon = <Spinner fontSize="20px" />;
  let userType = null;
  if (!props.searching) {
    icon = !props.isStudent ? (
      <img
        src={studentIcon}
        alt="black student hat"
        className={classes.userIcon}
      />
    ) : (
      <img
        src={recruiterIcon}
        alt="black student hat"
        className={classes.userIcon}
      />
    );
    name = <span>{props.name}</span>;
  } else {
    props.isStudent ? (userType = "reviewer...") : (userType = "student...");
    name = (
      <span className={classes.SearchingTitle}>Searching for a {userType}</span>
    );
  }

  return (
    <div className={classes.NameCardContainer}>
      {icon}
      {name}
    </div>
  );
};
export default nameCard;
