import * as actionTypes from "./actionTypes";

import axios from "../../axios-orders";

/*

QUEUE STUDENT TO A COMPANY 

*/

export const queueInit = (companyId, index) => {
  return {
    type: actionTypes.QUEUE_INIT,
    companyId: companyId,
    index: index,
  };
};

export const queueSuccess = (companyId, index) => {
  return {
    type: actionTypes.QUEUE_SUCCESS,
    companyId: companyId,
    index: index,
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

  return (dispatch, getState) => {
    // We also store the companies' states in local storage

    dispatch(queueInit(companyId, index));

    axios
      .post("/user/enqueue/" + companyId)

      .then((res) => {
        // console.log(res);
        let response = res.data; // This is where I get my initial queue position?

        // Consider alternative approach where we only push queued things into the state
        // We push company ids into the array simply.

        // Get the companies from state
        const companies = getState().companies.companies;

        // This array will contain objects where each object is the company's status
        // let companiesStatus = [];

        // // Properties of interest for filtering
        // const status = ["_id", "hadSession", "isQueued"];

        // // Go through the companies state array
        // for (let i = 0; i < companies.length; i++) {
        //   // Extract the company with specific properties filtered

        //   companiesStatus.push(
        //     Object.keys(companies[i])
        //       .filter((key) => status.includes(key))
        //       .reduce((obj, key) => {
        //         obj[key] = companies[i][key];
        //         return obj;
        //       }, {})
        //   );
        // }

        // // Update the company that is queued
        // companiesStatus[index].isQueued = true;

        // Save the company statuses
        // localStorage.setItem("companiesStatus", companiesStatus);

        dispatch(queueSuccess(companyId, index));
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
  return (dispatch, getState) => {
    // console.log(companyId);
    dispatch(dequeueInit(companyId, index));

    axios
      .post("/user/dequeue/" + companyId)

      .then((res) => {
        // console.log(res);
        let response = res.data; // This is where I get my initial queue position?

        // const companies = getState().companies.companies;

        // // This array will contain objects where each object is the company's status
        // let companiesStatus = [];

        // // Properties of interest for filtering
        // const status = ["_id", "hadSession", "isQueued"];

        // // Go through the companies state array
        // for (let i = 0; i < companies.length; i++) {
        //   // Extract the company with specific properties filtered
        //   companiesStatus.push(
        //     Object.keys(companies[i])
        //       .filter((key) => status.includes(key))
        //       .reduce((obj, key) => {
        //         obj[key] = companies[i][key];
        //         return obj;
        //       }, {})
        //   );
        // }

        // // Update the company that is queued
        // companiesStatus[index].isQueued = true;

        // // Save the company statuses
        // localStorage.setItem("companiesStatus", companiesStatus);

        dispatch(dequeueSuccess(companyId, index));
      })
      .catch((error) => {
        dispatch(dequeueFail(companyId, index, error));
      });
  };
};
