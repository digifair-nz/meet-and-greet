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
    // Also check credentials for a room session and redirect to the room if credentials are found
    this.props.onTryAutoSignUp();
    console.log(this.props.hasCredentials);
    // localStorage.getItem("event")
    console.log(this.props.eventId);
  }

  render() {
    let urlWithEventId = "/sign-in";

    if (this.props.eventId !== null) {
      urlWithEventId += "/" + this.props.eventId;
    }

    let routes = (
      <Switch>
        <Route path="/sign-in/:id" component={Auth} exact />
        {/* <Route path="/" component={StudentDashboard} exact /> */}
        <Redirect to={urlWithEventId} />
      </Switch>
    );

    if (this.props.isAuthenticated && this.props.isStudent) {
      routes = (
        <Switch>
          <Route path="/" component={StudentDashboard} exact />
          <Route path="/chat-room" component={ChatRoom} exact />
          <Route path="/sign-in" component={Auth} exact />

          <Redirect to="/" />
        </Switch>
      );
    }

    if (
      this.props.isAuthenticated &&
      this.props.hasCredentials &&
      this.props.isStudent
    ) {
      routes = (
        <Switch>
          <Route path="/chat-room" component={ChatRoom} exact />
          <Route path="/" component={StudentDashboard} exact />
          <Redirect to="/chat-room" />
        </Switch>
      );
    } else if (this.props.isAuthenticated && !this.props.isStudent) {
      routes = (
        <Switch>
          <Route path="/chat-room" component={ChatRoom} exact />

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
    hasCredentials: state.user.credentials !== null,
    eventId: state.user.eventId,
    isStudent: state.user.isStudent,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignUp: () => dispatch(actions.authCheckState()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
