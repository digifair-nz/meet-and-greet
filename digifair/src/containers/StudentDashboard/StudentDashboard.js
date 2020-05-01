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

class StudentDashboard extends Component {
  state = {
    companies: [
      { companyName: "Google", companyLogo: googleLogo },
      { companyName: "Xero", companyLogo: xeroLogo },
      { companyName: "Imagr", companyLogo: imagrLogo },
      { companyName: "Google", companyLogo: googleLogo },
      { companyName: "Xero", companyLogo: xeroLogo },
    ],
  };

  render() {
    let companyCards = this.state.companies.map((company) => {
      return (
        <CompanyCard src={company.companyLogo} key={company.companyName} />
      );
    });
    return (
      <Aux>
        <div className={classes.CompanyCardContainer}>{companyCards}</div>
      </Aux>
    );
  }
}
export default StudentDashboard;
