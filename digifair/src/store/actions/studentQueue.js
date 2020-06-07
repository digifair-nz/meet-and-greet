import * as actionTypes from "./actionTypes";

import instance from "../../axios-instance";
// import axios from "axios";

// const instance = axios.create({});

// (function () {
//   const token = localStorage.getItem("token");
//   if (token) {
//     instance.defaults.headers.common["auth-token"] = token;
//   } else {
//     instance.defaults.headers.common["auth-token"] = null;
//   }
// })();

// instance.interceptors.request.use(function (config) {
//   const token = localStorage.getItem("token");
//   config.headers.common["auth-token"] = token;

//   return config;
// });
// const instance = axios.create({});

// (function () {
//   const token = localStorage.getItem("token");

//   if (token) {
//     instance.defaults.headers.common["auth-token"] = token;
//   }
// })();

/*

QUEUE STUDENT TO A COMPANY 

*/
//axios.defaults.header.common[Auth_Token] = token
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

    instance
      .post("/user/enqueue/" + companyId)

      .then((res) => {
        dispatch(queueSuccess(companyId, index, res.data.queuePosition));
      })
      .catch((error) => {
        dispatch(queueFail(companyId, index, error));
      });
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

    instance
      .post("/user/dequeue/" + companyId)

      .then((res) => {
        // console.log(res);

        dispatch(dequeueSuccess(companyId, index));
      })
      .catch((error) => {
        dispatch(dequeueFail(companyId, index, error));
      });
  };
};

export const declineJoinChatroom = (companyId, index) => {
  return (dispatch) => {
    dispatch(dequeueInit(companyId, index));
    dispatch(dequeueSuccess(companyId, index));
  };
};
