import React from "react";

import Button from "../UI/Button/Button";
import classes from "./ReadyCheckPrompt.module.css";

const readyCheckPrompt = (props) => {
  return (
    <div className={classes.PromptContainer}>
      <img className={classes.Logo} src={props.logo} alt="Company logo" />
      <div className={classes.ContentContainer}>
        <span>The company is ready for you!</span>
        <span>Timer</span>
        <span>Ready?</span>
      </div>
      <div className={classes.ButtonContainer}>
        <Button btnType="Success">Accept</Button>
        <Button btnType="Danger">Decline</Button>
      </div>
    </div>
  );
};
export default readyCheckPrompt;
