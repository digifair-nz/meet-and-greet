import React from "react";

import classes from "./Input.module.css";

import keyIcon from "../../../assets/icons/white-key.png";
import userIcon from "../../../assets/icons/white-user.png";
const input = (props) => {
  const inputClasses = [classes.InputElement];

  let autoCompleteType = "email";

  if (props.elementConfig.type === "password") {
    autoCompleteType = "current-password";
  }

  let inputElement = (
    <input
      className={inputClasses.join(" ")}
      {...props.elementConfig}
      value={props.value}
      onChange={props.changed}
      autoComplete={autoCompleteType}
    />
  );

  if (props.invalid && props.shouldValidate && props.touched) {
    inputClasses.push(classes.Invalid);
  }

  //   let validationError = null;
  //   if (props.invalid && props.touched) {
  //     validationError = (
  //       <p style={{ color: "red" }}>Please enter a valid value!</p>
  //     );
  //   }
  let icon = keyIcon;
  let alt = "Key icon";

  if (props.elementConfig.type === "email") {
    icon = userIcon;
    alt = "User icon";
  }

  return (
    <div className={classes.Input}>
      <div className={classes.IconWrapper}>
        <img alt={alt} className={classes.InputIcon} src={icon} />
      </div>

      {inputElement}
      {/* {validationError} */}
    </div>
  );
};

export default input;
