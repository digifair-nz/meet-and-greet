import React, { Component } from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "./store/actions/index";
// Containers

import StudentDashboard from "./containers/StudentDashboard/StudentDashboard";
import Auth from "./containers/Authenticaiton/StudentAuth/Auth";
import ChatRoom from "./containers/ChatRoom/ChatRoom";
// HOC
import Layout from "./hoc/Layout/Layout";

import "./App.css";

// This will need to be refractored so that it can be reused for both types of users --> Companies and Students
class App extends Component {
  componentDidMount() {
    // check users local storage for a token and try to sign them in automatically
    this.props.onTryAutoSignUp();
    this.props.onTryAutoJoinChatroom();
  }

  render() {
    let routes = (
      <Switch>
        <Route path="/sign-in" component={Auth} />
        {/* <Route path="/" component={StudentDashboard} exact /> */}
        <Redirect to="/sign-in" />
      </Switch>
    );

    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/chat-room" component={ChatRoom} />
          <Route path="/sign-in" component={Auth} />
          <Route path="/" component={StudentDashboard} exact />
        </Switch>
      );
    }

    if (this.props.isAuthenticated && this.props.hasCredentials) {
      routes = (
        <Switch>
          <Route path="/chat-room" component={ChatRoom} />
          <Redirect to="/chat-room" />
        </Switch>
      );
    } else if (
      this.props.isAuthenticated &&
      this.props.recruiterHasCredentials
    ) {
      routes = (
        <Switch>
          <Route path="/chat-room" component={ChatRoom} />
          <Redirect to="/chat-room" />
        </Switch>
      );
    }

    return (
      <div className="App">
        <Layout>{routes}</Layout>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.user.token !== null, // Change later to cater for all the companies
    token: state.user.token,
    hasCredentials: state.user.credentials != null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignUp: () => dispatch(actions.authCheckState()),
    onTryAutoJoinChatroom: () => dispatch(actions.checkCredentials()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
