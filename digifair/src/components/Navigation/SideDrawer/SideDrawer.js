import React from "react";

import Logo from "../../../assets/company_logos/digifair-white.png";

import classes from "./SideDrawer.module.css";
import Backdrop from "../../UI/Backdrop/Backdrop";
import Aux from "../../../hoc/Auxiliary";

const sideDrawer = (props) => {
  let attachedClasses = [classes.SideDrawer, classes.Close];
  if (props.open) {
    attachedClasses = [classes.SideDrawer, classes.Open];
  }
  return (
    <Aux>
      <Backdrop show={props.open} clicked={props.closed} />
      <div onClick={props.closed} className={attachedClasses.join(" ")}>
        <div className={classes.Logo}>
          {/* <img src={Logo} /> */}
        </div>
        <nav></nav>
      </div>
    </Aux>
  );
};

export default sideDrawer;
