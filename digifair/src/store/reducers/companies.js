import * as actionTypes from "../actions/actionTypes";

import googleLogo from "../../assets/company_logos/googleLogo.png";
import xeroLogo from "../../assets/company_logos/xeroLogo.png";
import imagrLogo from "../../assets/company_logos/imagrLogo.png";
import soulMachinesLogo from "../../assets/company_logos/soulMachinesLogo.png";
import { updateObject } from "../utility";
const initialState = {
  companies: [
    {
      companyId: "Google",
      companyLogo: googleLogo,
      isQueued: false,
      hadSession: false,
    },
    {
      companyId: "Xero",
      companyLogo: xeroLogo,
      isQueued: false,
      hadSession: false,
    },
    {
      companyId: "Imagr",
      companyLogo: imagrLogo,
      isQueued: false,
      hadSession: false,
    },
    {
      companyId: "Soul Machines",
      companyLogo: soulMachinesLogo,
      isQueued: false,
      hadSession: true,
    },
    {
      companyId: "Xero2",
      companyLogo: xeroLogo,
      isQueued: false,
      hadSession: false,
    },
  ],
};

// Queue Init (sends a companyId and current queue status) if all good then queue start
//
const startQueueSuccess = (state, action) => {
  let updatedCompanies = [...state.companies];

  let updatedCompany = { ...updatedCompanies[action.companyId] };

  updatedCompany.isQueued = true;
  updatedCompanies[action.companyId] = updatedCompany;
  console.log(updatedCompanies);
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
