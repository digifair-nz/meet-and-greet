import * as actionTypes from "./actionTypes";

import axios from "../../axios-orders";

export const fetchCompaniesStart = () => {
  return {
    type: actionTypes.FETCH_COMPANIES_START,
  };
};

export const fetchCompanies = () => {
  return (dispatch) => {
    dispatch(fetchCompaniesStart());
  };
};

export const startQueueSuccess = (companyId) => {
  return {
    type: actionTypes.START_QUEUE_SUCCESS,
    companyId: companyId,
  };
};

export const startQueueFail = (error) => {
  return {
    type: actionTypes.START_QUEUE_FAIL,
    error: error,
  };
};
export const startQueueInit = () => {
  return {
    type: actionTypes.START_QUEUE_INIT,
  };
};

export const queueStudent = (companyId) => {
  const company = { companyId: companyId, isQueued: false };
  return (dispatch) => {
    dispatch(startQueueInit);
    axios
      .post("/queue.json", company)
      .then((res) => {
        
        dispatch(startQueueSuccess(companyId));
      })
      .catch((error) => {
        dispatch(startQueueFail(error));
      });
  };
};
