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

export const recruiterInviteNextStudentStart = () => {
  return {
    type: actionTypes.RECRUITER_INVITE_NEXT_STUDENT_START,
  };
};

export const recruiterInviteNextStudentSuccess = () => {
  return {
    type: actionTypes.RECRUITER_INVITE_NEXT_STUDENT_SUCCESS,
  };
};

export const recruiterInviteNextStudentFail = (error) => {
  return {
    type: actionTypes.RECRUITER_INVITE_NEXT_STUDENT_FAIL,
    error: error,
  };
};

export const recruiterInviteNextStudent = () => {
  return (dispatch) => {
    dispatch(recruiterInviteNextStudentStart());
    // const token = localStorage.getItem("token");

    axios
      .post("/company/next/")
      .then((response) => {
        console.log(response);

        dispatch(recruiterInviteNextStudentSuccess());
      })
      .catch((err) => {
        console.log(err);

        dispatch(recruiterInviteNextStudentFail(err));
      });
  };
};
