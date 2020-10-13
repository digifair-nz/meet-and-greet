import * as actionTypes from "./actionTypes";

import instance from "../../axios-instance";

/*

QUEUE STUDENT TO THE COMPANIES

*/

export const queueToAllStart = () => {
  return {
    type: actionTypes.QUEUE_TO_ALL_START,
  };
};

export const queueToAllSuccess = (companies) => {
  // This will give back an array of company objects where...
  // [ { companyId, queuePosition}....]
  // Are all the companies that the student has succesfully queued to.

  return {
    type: actionTypes.QUEUE_TO_ALL_SUCCESS,
    companies: companies,
  };
};

export const queueToAllFail = (error) => {
  return {
    type: actionTypes.QUEUE_TO_ALL_FAIL,
    error: error,
  };
};

// This will enqueue the student to all available companies
export const queueToAll = () => {
  return (dispatch) => {
    dispatch(queueToAllStart());

    instance
      .post("/user/enqueue/")

      .then((res) => {
        console.log(res);
        dispatch(queueToAllSuccess(res.data.positions));
      })
      .catch((error) => {
        dispatch(queueToAllFail(error.response.data));
      });
  };
};

export const dequeueFromAllStart = () => {
  return {
    type: actionTypes.DEQUEUE_FROM_ALL_START,
  };
};

export const dequeueFromAllSuccess = (companies) => {
  // This will give back an array of company objects where...
  // [ { companyId, queuePosition}....]
  // Are all the companies that the student has succesfully queued to.

  return {
    type: actionTypes.DEQUEUE_FROM_ALL_SUCCESS,
    companies: companies,
  };
};

export const dequeueFromAllFail = (error) => {
  return {
    type: actionTypes.DEQUEUE_FROM_ALL_FAIL,
    error: error,
  };
};

// This will enqueue the student to all available companies
export const dequeueFromAll = () => {
  return (dispatch) => {
    dispatch(dequeueFromAllStart());

    instance
      .post("/user/dequeue/")

      .then((res) => {
        console.log(res);
        dispatch(dequeueFromAllSuccess());
      })
      .catch((error) => {
        dispatch(dequeueFromAllFail(error.response.data));
      });
  };
};

/**
 * initialize queue to a specific comapny
 * @param {string} companyId
 * @param {int} index which is the position of the company in the array
 */
export const queueInit = (companyId, index) => {
  return {
    type: actionTypes.QUEUE_INIT,
    companyId: companyId,
    index: index,
  };
};

export const queueSuccess = (companyId, index, queuePosition) => {
  return {
    type: actionTypes.QUEUE_SUCCESS,
    companyId: companyId,
    index: index,
    queuePosition: queuePosition,
  };
};

export const queueFail = (companyId, index, error) => {
  return {
    type: actionTypes.QUEUE_FAIL,
    error: error,
    companyId: companyId,
    index: index,
  };
};

export const queueStudent = (companyId, index) => {
  // Company id will be an alphanumeric string used for making a request to an appropriate endpoint
  // index refers to the position in the state array (companies)

  return (dispatch) => {
    dispatch(queueInit(companyId, index));

    dispatch(queueSuccess(companyId, index, 1));
  };
};

/*

DEQUEUE STUDENT TO A COMPANY 
(cancel active queue)

*/
export const dequeueInit = (companyId, index) => {
  return {
    type: actionTypes.DEQUEUE_INIT,
    companyId: companyId,
    index: index,
  };
};

export const dequeueSuccess = (companyId, index) => {
  return {
    type: actionTypes.DEQUEUE_SUCCESS,
    companyId: companyId,
    index: index,
  };
};

export const dequeueFail = (companyId, index, error) => {
  return {
    type: actionTypes.DEQUEUE_FAIL,
    error: error,
    companyId: companyId,
    index: index,
  };
};

export const dequeueStudent = (companyId, index) => {
  return (dispatch) => {
    dispatch(dequeueInit(companyId, index));

    dispatch(dequeueSuccess(companyId, index));
  };
};

export const declineJoinChatroom = (companyId, index) => {
  return (dispatch) => {
    dispatch(dequeueInit(companyId, index));
    dispatch(dequeueSuccess(companyId, index));
  };
};
