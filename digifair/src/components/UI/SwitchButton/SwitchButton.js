import React from "react";

import companyIcon from "../../../assets/icons/tie-white.png";
import studentIcon from "../../../assets/icons/student-hat.png";
import "./SwitchButton.css";

const switchButton = (props) => {
  return (
    <div className="switchContainer">
      <span className="switchTitle">
        Hi! Are you a {props.isStudent ? "Student" : "Recruiter"} ?
      </span>
      <label className="switch">
        <input onClick={props.switchUser} type="checkbox" />
        <span className="slider round">
          {props.isStudent ? (
            <img src={studentIcon} className="switchIconStudent" />
          ) : (
            <img src={companyIcon} className="switchIconCompany" />
          )}
        </span>
      </label>
    </div>
  );
};
export default switchButton;
