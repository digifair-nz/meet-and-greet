import * as actionTypes from "../actions/actionTypes";

import googleLogo from "../../assets/company_logos/googleLogo.png";
import xeroLogo from "../../assets/company_logos/xeroLogo.png";
import imagrLogo from "../../assets/company_logos/imagrLogo.png";
import { updateObject } from "../utility";
const initialState = {
  companies: [
    { companyId: "Google", companyLogo: googleLogo, isQueued: false },
    { companyId: "Xero", companyLogo: xeroLogo, isQueued: false },
    { companyId: "Imagr", companyLogo: imagrLogo, isQueued: false },
    { companyId: "Google2", companyLogo: googleLogo, isQueued: false },
    { companyId: "Xero2", companyLogo: xeroLogo, isQueued: false },
  ],
};

// Queue Init (sends a companyId and current queue status) if all good then queue start
//
const startQueueSuccess = (state, action) => {
  // Change queue status of the desired company

  let updatedCompanies = [...state.companies];
  let updatedCompany = updatedCompanies[action.companyId];
  updatedCompany.isQueued = true;

  // let updatedCompany = state.companies.filter(
  //   (company) => company.companyId === action.companyId
  // );

  // updatedCompany = updatedCompany[0];

  // updatedCompany.isQueued = true;

  // let updatedCompanies = state.companies.filter(
  //   (company) => company.companyId != action.companyId
  // );

  // updatedCompanies = updatedCompanies.concat(updatedCompany);

  return {
    ...state,
    companies: updatedCompanies,
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_COMPANIES_START:
      return state;
    // case actionTypes.START_QUEUE_INIT:
    //   return state;
    case actionTypes.START_QUEUE_SUCCESS:
      return startQueueSuccess(state, action);
    default:
      return state;
  }
};
export default reducer;
