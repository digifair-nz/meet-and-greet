import React, { Component } from "react";
import Aux from "../Auxillary";
import classes from "./Layout.module.css";
class Layout extends Component {
  render() {
    return (
      <Aux>
        <div>Header</div>
        <main className={classes.Content}>{this.props.children}</main>
      </Aux>
    );
  }
}

export default Layout;
