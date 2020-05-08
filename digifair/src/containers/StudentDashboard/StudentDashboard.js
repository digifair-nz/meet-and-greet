import React, { Component } from "react";

import Aux from "../../hoc/Auxillary";

// Components
import CompanyCard from "../../components/StudentDashbaord/CompanyCard/CompanyCard";
import Modal from "../../components/UI/Modal/Modal";

// CSS
import classes from "./StudentDashboard.module.css";

//Redux
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

class StudentDashboard extends Component {
  /*
  The dashboard students will see during the event. The dasboard will contain company cards which will represent
  different companies that are participating during the event.

  This dashboard reaches out to the store (which fetches company data from the server) and populates the container
  with CompanyCard component.

  It also manages the queue status by dispatching actions 


  Author: Michael Shaimerden (michael@tadesign.co.nz)  May - 2020
  */

  state = {
    q: [12, 13, 5, 3, 5],
  };
  componentDidMount() {
    this.props.fetchCompanies();
  }

  queueToCompanyHandler = (companyId) => {
    this.props.queueToCompany(companyId);
  };
  render() {
    let companyCards = this.props.companies.map((company, index) => {
     
      return (
        <CompanyCard
          companyId={index}
          isQueued={company.isQueued}
          companyLogo={company.companyLogo}
          key={company.companyId}
          hadSession={company.hadSession}
          queuePosition={this.state.q[index]}
        />
      );
    });
    return (
      <Aux>
        <div className={classes.CompanyCardContainer}>{companyCards}</div>
        {/* <Modal show={true}><div><h1>Hello</h1></div></Modal> */}
      </Aux>
    );
  }
}

// Redux
const mapStateToProps = (state) => {
  return {
    companies: state.companies,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCompanies: () => dispatch(actions.fetchCompanies()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentDashboard);
