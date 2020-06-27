import React from "react";

import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

import Modal from "../UI/Modal/Modal";

import errorIcon from "../../assets/icons/error.png";

import classes from "./ErrorPopup.module.css";

/*

This is shown when an error occurs 

*/

const errorPopup = (props) => {
  //Incase the event has been reset, log the user out
  if (props.error) {
    if (props.error.reloginRequired) {
      props.logout();
    }
  }

  console.log(props.error);
  return (
    <Modal show={props.show} modalClosed={props.modalClosed}>
      <div className={classes.ErrorContainer}>
        <img
          src={errorIcon}
          className={classes.ErrorIcon}
          alt="Triangular hazard sign with exclimation point and red border or error sign"
        />
        <span>Nice one. Something went wrong because...</span>
        <h2 className={classes.ErrorMessage}>
          {props.error ? props.error.message : null}
        </h2>
      </div>
    </Modal>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(actions.logout()),
  };
};

export default connect(null, mapDispatchToProps)(errorPopup);
