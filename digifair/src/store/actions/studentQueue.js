import * as actionTypes from "./actionTypes";

import axios from "../../axios-orders";

/*

QUEUE STUDENT TO A COMPANY 

*/

export const queueInit = (companyId) => {
  return {
    type: actionTypes.QUEUE_INIT,
    companyId: companyId,
  };
};

export const queueSuccess = (companyId) => {
  return {
    type: actionTypes.QUEUE_SUCCESS,
    companyId: companyId,
  };
};

export const queueFail = (error, companyId) => {
  return {
    type: actionTypes.QUEUE_FAIL,
    error: error,
    companyId: companyId,
  };
};

export const queueStudent = (companyId) => {
  const company = { companyId: companyId, isQueued: false };
  return (dispatch) => {
    dispatch(queueInit(companyId));
    axios
      .post("/queue.json", company)
      .then((res) => {
        dispatch(queueSuccess(companyId));
      })
      .catch((error) => {
        console.log(error);
        dispatch(queueFail(error));
      });
  };
};

/*

DEQUEUE STUDENT TO A COMPANY 
(cancel active queue)

*/
export const dequeueInit = (companyId) => {
  return {
    type: actionTypes.DEQUEUE_INIT,
    companyId: companyId,
  };
};

export const dequeueSuccess = (companyId) => {
  return {
    type: actionTypes.DEQUEUE_SUCCESS,
    companyId: companyId,
  };
};

export const dequeueFail = (error, companyId) => {
  return {
    type: actionTypes.DEQUEUE_FAIL,
    error: error,
    companyId: companyId,
  };
};

export const dequeueStudent = (companyId) => {
  const company = { companyId: companyId, isQueued: true };
  return (dispatch) => {
    dispatch(dequeueInit(companyId));
    axios
      .post("/queue.json", company)
      .then((res) => {
        dispatch(dequeueSuccess(companyId));
      })
      .catch((error) => {
        console.log(error);
        dispatch(dequeueFail(error, companyId));
      });
  };
};
