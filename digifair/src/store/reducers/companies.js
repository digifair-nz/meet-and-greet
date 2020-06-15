import * as actionTypes from "../actions/actionTypes";
import cloneDeep from "lodash/cloneDeep";

import { updateObject } from "../utility";

/*

This reducer is responsible for the companies slice of the state 
which includes the companies that the student sees and can queue too

It contains information necessary to queue users or dequeue them or update 
their queue position for specific queued companies

*/

const initialState = {
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
  action.companies.map((company) => (company.queuing = false));

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

// Queue to all
const queueToAllStart = (state, action) => {
  // Make all the companies load
  return updateObject(state, {
    loading: true,
  });
};

const queueToAllSuccess = (state, action) => {
  const updatedCompanies = cloneDeep(state.companies); // Make a deep copy of the companies array

  updatedCompanies.map((company) => {
    // Loop through all the companies
    for (let i = 0; i < action.companies.length; i++) {
      // Update their queuePositions and isQueued

      if (company._id === action.companies[i].queueId) {
        company.isQueued = true;
        company.queuePosition = action.companies[i].queuePosition;
      }
      //return company;
    }
  });

  return updateObject(state, {
    loading: false,

    companies: updatedCompanies,
  });
};

const queueToAllFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.error,
  });
};

const dequeueFromAllStart = (state, action) => {
  // Make all the companies load
  return updateObject(state, {
    loading: true,
  });
};

const dequeueFromAllSuccess = (state, action) => {
  const updatedCompanies = cloneDeep(state.companies); // Make a deep copy of the companies array

  updatedCompanies.map((company) => {
    // Loop through all the companies

    if (company.isQueued && !company.hadSession) {
      company.isQueued = false;
      company.queuePosition = null;
    }
  });

  return updateObject(state, {
    loading: false,

    companies: updatedCompanies,
  });
};

const dequeueFromAllFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.error,
  });
};

// Queue for a specific company

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

  return updateObject(state, {
    companies: updatedCompanies,
    error: action.error,
  });
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
  return updateObject(state, {
    companies: updatedCompanies,
    error: action.error,
  });
};

/********************
UPDATE QUEUE POSITION
********************/
const updateQueuePosition = (state, action) => {
  // given companyId and queuePos, update the current position of the student for a specific company

  let updatedCompanies = [...state.companies];

  let updatedCompany;
  // console.log(action);
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

// Disable Company for student (hadSession)
// This is called when the student has had a session with the company.
// Specifically, this is called when the student accepts to join the chatroom

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
    case actionTypes.QUEUE_TO_ALL_START:
      return queueToAllStart(state, action);
    case actionTypes.QUEUE_TO_ALL_SUCCESS:
      return queueToAllSuccess(state, action);
    case actionTypes.QUEUE_TO_ALL_FAIL:
      return queueToAllFail(state, action);
    case actionTypes.DEQUEUE_FROM_ALL_START:
      return dequeueFromAllStart(state, action);
    case actionTypes.DEQUEUE_FROM_ALL_SUCCESS:
      return dequeueFromAllSuccess(state, action);
    case actionTypes.DEQUEUE_FROM_ALL_FAIL:
      return dequeueFromAllFail(state, action);
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
    case actionTypes.CLEAR_ERROR:
      return updateObject(state, { error: null });
    default:
      return state;
  }
};
export default reducer;
