import React, { Component } from "react";
import { connect } from "react-redux";

import Aux from "../Auxiliary";

import classes from "./Layout.module.css";

class Layout extends Component {
  //NOTE: Might refractor later!
  render() {
    return (
      <Aux>
        <main className={classes.Content}>{this.props.children}</main>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.student.token !== null,
  };
};

export default connect(mapStateToProps)(Layout);
