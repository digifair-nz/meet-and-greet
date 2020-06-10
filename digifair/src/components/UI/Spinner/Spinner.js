import React from "react";

import classes from "./Spinner.module.css";

const spinner = (props) => {
  let spinnerColor =
    props.spinnerColor === "White" ? classes.LoaderWhite : classes.LoaderPink;

  return (
    <div style={{ fontSize: props.fontSize }} className={spinnerColor}>
      Loading...
    </div>
  );
};
export default spinner;
