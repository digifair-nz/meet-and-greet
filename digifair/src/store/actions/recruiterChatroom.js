import axios from "../../axios-instance";

import * as actionTypes from "./actionTypes";

/**
 * initialize queue to a specific comapny
 * @param {string} companyId
 * @param {int} index which is the position of the company in the array
 */
export const kickStudentStart = () => {
  return {
    type: actionTypes.COMPANY_KICK_STUDENT_START,
  };
};

export const kickStudentSuccess = () => {
  return {
    type: actionTypes.COMPANY_KICK_STUDENT_SUCCESS,
  };
};

export const kickStudentFail = (error) => {
  return {
    type: actionTypes.COMPANY_KICK_STUDENT_FAIL,
    error: error,
  };
};
export const kickStudent = () => {
  return (dispatch) => {
    dispatch(fetchCompaniesStart());
    // const token = localStorage.getItem("token");

    axios
      .get("/company/kick/")
      .then((response) => {
        // console.log(response);
        dispatch(kickStudentSuccess());
      })
      .catch((err) => {
        console.log(err);

        dispatch(kickStudentFail(err));
      });
  };
};
