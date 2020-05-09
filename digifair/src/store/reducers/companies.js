import * as actionTypes from "../actions/actionTypes";

import googleLogo from "../../assets/company_logos/googleLogo.png";
import xeroLogo from "../../assets/company_logos/xeroLogo.png";
import imagrLogo from "../../assets/company_logos/imagrLogo.png";
import soulMachinesLogo from "../../assets/company_logos/soulMachinesLogo.png";
import { updateObject } from "../utility";
const initialState = {
  /// REFRACTOR FOR IS QUEUED
  companies: [
    {
      companyId: "Google",
      companyLogo: googleLogo,
      isQueued: false,
      hadSession: false,
      queuing: false,
      companyDescription:
        "Google LLC is an American multinational technology company that specializes in Internet-related services and products, which include online advertising technologies, a search engine, cloud computing, software, and hardware",
    },
    {
      companyId: "Xero",
      companyLogo: xeroLogo,
      isQueued: false,
      hadSession: false,
      queuing: false,
      companyDescription:
        "Xero is a New Zealand domiciled public technology company, listed on the Australian Stock Exchange. Xero offers a cloud-based accounting software platform for small and medium-sized businesses",
    },
    {
      companyId: "Imagr",
      companyLogo: imagrLogo,
      isQueued: false,
      hadSession: false,
      queuing: false,
      companyDescription:
        "Xero is a New Zealand domiciled public technology company, listed on the Australian Stock Exchange. Xero offers a cloud-based accounting software platform for small and medium-sized businesses",
    },
    {
      companyId: "Soul Machines",
      companyLogo: soulMachinesLogo,
      isQueued: false,
      hadSession: true,
      queuing: false,
      companyDescription:
        "Xero is a New Zealand domiciled public technology company, listed on the Australian Stock Exchange. Xero offers a cloud-based accounting software platform for small and medium-sized businesses",
    },
    {
      companyId: "Xero2",
      companyLogo: xeroLogo,
      isQueued: false,
      hadSession: false,
      queuing: false,
      companyDescription:
        "Xero is a New Zealand domiciled public technology company, listed on the Australian Stock Exchange. Xero offers a cloud-based accounting software platform for small and medium-sized businesses",
    },
  ],
};

// Queue

const queueInit = (state, action) => {
  // Update the company queuing status to true on initialization of the action

  let updatedCompanies = [...state.companies]; // shallow copy of the state array

  let updatedCompany = { ...updatedCompanies[action.companyId] }; // copy of the state object

  updatedCompany.queuing = true;
  updatedCompanies[action.companyId] = updatedCompany;

  return updateObject(state, { companies: updatedCompanies });
};

const queueSuccess = (state, action) => {
  // Update the company queuing status to false on finished action of the action
  let updatedCompanies = [...state.companies];

  let updatedCompany = { ...updatedCompanies[action.companyId] };

  updatedCompany.isQueued = true;
  updatedCompany.queuing = false;
  updatedCompanies[action.companyId] = updatedCompany;

  return updateObject(state, { companies: updatedCompanies });
};

const queueFail = (state, action) => {
  let updatedCompanies = [...state.companies];

  let updatedCompany = { ...updatedCompanies[action.companyId] };

  updatedCompany.queuing = false;
  updatedCompanies[action.companyId] = updatedCompany;

  return updateObject(state, { companies: updatedCompanies });
};

const dequeueInit = (state, action) => {
  let updatedCompanies = [...state.companies];

  let updatedCompany = { ...updatedCompanies[action.companyId] };

  updatedCompany.queuing = true;
  updatedCompanies[action.companyId] = updatedCompany;

  return updateObject(state, { companies: updatedCompanies });
};

// DEQUEUE
const dequeueSuccess = (state, action) => {
  let updatedCompanies = [...state.companies];

  let updatedCompany = { ...updatedCompanies[action.companyId] };

  updatedCompany.isQueued = false;
  updatedCompanies[action.companyId] = updatedCompany;
  console.log(updatedCompanies);

  return updateObject(state, { companies: updatedCompanies });
};

const dequeueFail = (state, action) => {
  let updatedCompanies = [...state.companies];

  let updatedCompany = { ...updatedCompanies[action.companyId] };

  updatedCompany.isQueued = false;
  updatedCompanies[action.companyId] = updatedCompany;
  console.log(updatedCompanies);

  return updateObject(state, { companies: updatedCompanies });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    //refractor
    case actionTypes.FETCH_COMPANIES_START:
      //
      return state;
    case actionTypes.QUEUE_INIT:
      return queueInit(state, action);
    case actionTypes.QUEUE_SUCCESS:
      return queueSuccess(state, action);
    case actionTypes.QUEUE_FAIL:
      return queueFail(state, action);
    case actionTypes.DEQUEUE_INIT:
      return dequeueInit(state, action);
    case actionTypes.DEQUEUE_SUCCESS:
      return dequeueSuccess(state, action);
    case actionTypes.DEQUEUE_FAIL:
      return dequeueFail(state, action);
    default:
      return state;
  }
};
export default reducer;
