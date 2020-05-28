import React from "react";

import classes from "./Button.module.css";

// import logoutIcon from "../../../assets/icons/logout.png";
// The btnType refers to the class of the button which will change it's appearence
// The iconType has the following options: "None"(default),"Logout","Queue","Dequeue"
const button = (props) => {
  // let icon = null;
  // let iconType = classes.IconNone;
  // if (props.iconType === "Logout") {
  //   icon = logoutIcon;
  //   iconType = "Logout";
  // }

  return (
    <button
      disabled={props.disabled}
      className={[classes.Button, classes[props.btnType]].join(" ")}
      onClick={props.clicked}
    >
      {/* <img src={icon} className={iconType} /> */}
      {props.children}
    </button>
  );
};

export default button;
