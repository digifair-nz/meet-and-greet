import * as actionTypes from "./actionTypes";

import axios from "../../axios-instance";
// import axios from "axios";
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
    // const token = localStorage.getItem("token");
    // var xhr = new XMLHttpRequest();

    // xhr.open("POST", "/user/enqueue/" + companyId, true);
    // xhr.setRequestHeader("auth-token", token);
    // //console.time();
    // xhr.send();

    // xhr.onload = function () {
    //   //console.timeEnd();
    //   dispatch(queueSuccess(companyId, index, 0));
    //   console.log(xhr.responseText);
    // };
    console.time();
    axios
      .post("/user/test" /*+ companyId*/)

      .then((res) => {
        console.log(res);
        //
        console.timeEnd();

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
    // console.log(companyId);
    dispatch(dequeueInit(companyId, index));

    // var xhr = new XMLHttpRequest();
    // const token = localStorage.getItem("token");

    // xhr.open("POST", "/user/dequeue/" + companyId, true);
    // xhr.setRequestHeader("auth-token", token);
    // console.time();
    // xhr.send();

    // xhr.onload = function () {
    //   console.timeEnd();
    //   dispatch(dequeueSuccess(companyId, index));
    //   console.log(xhr.responseText);
    // };
    axios
      .post("/user/test" /*+ companyId*/)

      .then((res) => {
        // console.log(res);
        //let response = res.data;

        dispatch(dequeueSuccess(companyId, index));
      })
      .catch((error) => {
        dispatch(dequeueFail(companyId, index, error));
      });
  };
};
