import * as actionTypes from "../actions/actionTypes";

import { updateObject } from "../utility";
const initialState = {
  /// REFRACTOR FOR IS QUEUED?

  companies: null,
  loading: false,
  error: null,
};

/********************
Fetch companies
********************/
// Company fetching
const fetchCompaniesStart = (state, action) => {
  return {
    ...state,
    loading: true,
  };
};

const fetchCompaniesSuccess = (state, action) => {
  // [{ name,logo},{}]
  // add to each element in that array object

  // Initialize
  // later this will not be needed as I am getting isQueued and hadSession from fetching companies
  action.companies.map((company) => {
    // company.hadSession = false;
    // company.isQueued = false;
    company.queuing = false;
    // company.queuePosition = null;
  });

  // console.log(action.companies);
  return {
    ...state,
    companies: action.companies,
    loading: false,
  };
};

const fetchCompaniesFail = (state, action) => {
  return {
    ...state,
    loading: false,
    error: action.error,
  };
};

/********************
QUEUE/DEQUEUE STUDENT 
********************/
// Queue

/**
 * UpdateCompanyQueuing allows to reduce duplicate code and is used by reducer functions.
 * @param {Object} state
 * @param {int} index the position of the company in the company list
 * @param {boolean} queueStatus indicates whether the company is now queuing or not
 */
const updateCompanyQueuing = (state, index, queueStatus) => {
  // Returns an updated company queue status
  let updatedCompanies = [...state.companies]; // shallow copy of the state array

  let updatedCompany = { ...updatedCompanies[index] }; // copy of the state object

  updatedCompany.queuing = queueStatus;

  updatedCompanies[index] = updatedCompany;

  return updatedCompanies;
};

const queueInit = (state, action) => {
  let updatedCompanies = updateCompanyQueuing(state, action.index, true);

  return updateObject(state, { companies: updatedCompanies });
};

const queueSuccess = (state, action) => {
  // Update the company queuing status to false on finished action of the action
  let updatedCompanies = [...state.companies];

  let updatedCompany = { ...updatedCompanies[action.index] };

  updatedCompany.isQueued = true;
  updatedCompany.queuePosition = action.queuePosition;
  updatedCompany.queuing = false;
  updatedCompanies[action.index] = updatedCompany;

  return updateObject(state, { companies: updatedCompanies });
};

const queueFail = (state, action) => {
  let updatedCompanies = updateCompanyQueuing(state, action.index, false);

  return updateObject(state, { companies: updatedCompanies });
};

const dequeueInit = (state, action) => {
  let updatedCompanies = updateCompanyQueuing(state, action.index, true);

  return updateObject(state, { companies: updatedCompanies });
};

// DEQUEUE
const dequeueSuccess = (state, action) => {
  let updatedCompanies = [...state.companies];

  let updatedCompany = { ...updatedCompanies[action.index] };

  updatedCompany.isQueued = false;
  updatedCompany.queuing = false;

  updatedCompanies[action.index] = updatedCompany;

  return updateObject(state, { companies: updatedCompanies });
};

const dequeueFail = (state, action) => {
  let updatedCompanies = updateCompanyQueuing(state, action.index, false);
  return updateObject(state, { companies: updatedCompanies });
};

/********************
UPDATE QUEUE POSITION
********************/
const updateQueuePosition = (state, action) => {
  // given companyId and queuePos, update the current position of the student for a specific company

  let updatedCompanies = [...state.companies];

  let updatedCompany;
  console.log(action);
  // Find a specific company
  for (let i = 0; i < updatedCompanies.length; i++) {
    if (updatedCompanies[i]._id === action.companyId) {
      updatedCompany = { ...updatedCompanies[i] };

      updatedCompany.queuePosition = action.queuePosition;

      updatedCompanies[i] = updatedCompany;
      break;
    }
  }

  return updateObject(state, { companies: updatedCompanies });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    //refractor
    case actionTypes.FETCH_COMPANIES_START:
      //
      return fetchCompaniesStart(state, action);
    case actionTypes.FETCH_COMPANIES_SUCCESS:
      return fetchCompaniesSuccess(state, action);
    case actionTypes.FETCH_COMPANIES_FAIL:
      return fetchCompaniesFail(state, action);

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
    case actionTypes.UPDATE_QUEUE_POSITION:
      return updateQueuePosition(state, action);
    default:
      return state;
  }
};
export default reducer;
