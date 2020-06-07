import axios from "../../axios-instance";

import * as actionTypes from "./actionTypes";

/**
 * initialize queue to a specific comapny
 * @param {string} companyId
 * @param {int} index which is the position of the company in the array
 */
export const kickStudentStart = () => {
  return {
    type: actionTypes.RECRUITER_KICK_STUDENT_START,
  };
};

export const kickStudentSuccess = (credentials) => {
  return {
    type: actionTypes.RECRUITER_KICK_STUDENT_SUCCESS,
    credentials: credentials,
  };
};

export const kickStudentFail = (error) => {
  return {
    type: actionTypes.RECRUITER_KICK_STUDENT_FAIL,
    error: error,
  };
};

/**
 * The company will create another session after kicking a student to prevent previous students from joining
 *
 *
 */
export const kickStudent = () => {
  return (dispatch) => {
    dispatch(kickStudentStart());
    // const token = localStorage.getItem("token");

    axios
      .post("/company/kick/")
      .then((response) => {
        console.log(response);
        const credentials = response.data.credentials;
        localStorage.removeItem("credentials");
        localStorage.setItem("credentials", JSON.stringify(credentials));
        dispatch(kickStudentSuccess(response.data.credentials));
      })
      .catch((err) => {
        console.log(err);

        dispatch(kickStudentFail(err));
      });
  };
};
