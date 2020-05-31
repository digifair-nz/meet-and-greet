import React, { Component } from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "./store/actions/index";
// Containers

import StudentDashboard from "./containers/StudentDashboard/StudentDashboard";
import StudentAuth from "./containers/Authenticaiton/StudentAuth/StudentAuth";
import ChatRoom from "./containers/ChatRoom/ChatRoom";
// HOC
import Layout from "./hoc/Layout/Layout";

import "./App.css";

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignUp();

    // If the user is authenticated
    // Open a socket connection
    // Once connection is achieved, we expect to recieve the current queue positions of users for each company
    // We check if this user is in all queues.
    // If the user has a position in the queued array for a company
    // Dispatch an action to set his status isQueued to true and extract his position in the queue
    // (this will update his status and he can see where he is in the queue)
    // If the user is not in a queue for a particular company
    // Retrieve the number of people in the queue for that company and show the user how many people are currently in queue

    // Check local storage
    // We want to check if there are any companies the user has queued to
    // If the queued array is empty, proceed normally
    // If there is one or more elements in that array then
    // we extract it from local storage and dispatch the load action
    // the load action should take in the ids of that array  of the company
    // it should then update the
    // If localStorage.getItem("companiesStatus") not null
    // then retrieve them and call loadCompanyStatus (to dispatch the action)
  }

  render() {
    let routes = (
      <Switch>
        <Route path="/student-sign-in" component={StudentAuth} />
        {/* <Route path="/" component={StudentDashboard} exact /> */}
        <Redirect to="/student-sign-in" />
      </Switch>
    );

    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/chat-room" component={ChatRoom} />
          <Route path="/student-sign-in" component={StudentAuth} />
          <Route path="/" component={StudentDashboard} exact />
        </Switch>
      );
    }
    return (
      <div className="App">
        <Layout>
          <Route path="/chat-room" component={ChatRoom} />
          <Redirect to="/chat-room" />
          {/* {routes} */}
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.student.token !== null, // Change later to cater for all the companies
    token: state.student.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignUp: () => dispatch(actions.studentAuthCheckState()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
