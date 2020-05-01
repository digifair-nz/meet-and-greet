import React, { Component } from "react";

import Aux from "../../hoc/Auxillary";

// Components
import CompanyCard from "../../components/StudentDashbaord/CompanyCard/CompanyCard";

// TEMP! Hardcode images
import googleLogo from "../../assets/company_logos/googleLogo.png";
import xeroLogo from "../../assets/company_logos/xeroLogo.png";
import imagrLogo from "../../assets/company_logos/imagrLogo.png";

import classes from "./StudentDashboard.module.css";

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
          onClick={() => this.queueToCompanyHandler(index)}
          isQueued={company.isQueued}
          src={company.companyLogo}
          key={company.companyId}
        />
      );
    });
    return (
      <Aux>
        <div className={classes.CompanyCardContainer}>{companyCards}</div>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    companies: state.companies,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCompanies: () => dispatch(actions.fetchCompanies()),
    queueToCompany: (companyId) => dispatch(actions.queueStudent(companyId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentDashboard);
