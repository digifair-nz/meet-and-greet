import React, { Component } from "react";
import "./App.css";

// Packages
import { Route, Switch } from "react-router-dom";

// Containers

import StudentDashboard from "./containers/StudentDashboard/StudentDashboard";

// HOC
import Layout from "./hoc/Layout/Layout"

class App extends Component {
  render() {
    return (
      <div className="App">
        <Layout>
          <Switch>
            <Route path="/" component={StudentDashboard} exact />
          </Switch>
        </Layout>
      </div>
    );
  }
}
export default App;
