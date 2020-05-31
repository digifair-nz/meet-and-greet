import axios from "../../axios-orders";

import * as actionTypes from "./actionTypes";

// NOTE: Possibly refractor if there is easy reusability between student,company and club authentication process
export const studentAuthStart = () => {
  return {
    type: actionTypes.STUDENT_AUTH_START,
  };
};

export const studentAuthSuccess = (token) => {
  return {
    type: actionTypes.STUDENT_AUTH_SUCCESS,
    idToken: token,
  };
};

export const studentAuthFail = (error) => {
  return {
    type: actionTypes.STUDENT_AUTH_FAIL,
    error: error,
  };
};

export const studentLogout = () => {
  localStorage.removeItem("token");
  // localStorage.removeItem("expirationDate");

  return {
    type: actionTypes.STUDENT_AUTH_LOGOUT,
  };
};

export const studentCheckAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    // setTimeout(() => {
    //   // dispatch(studentLogout());
    // }, expirationTime * 1000); // Expiration time should be based on the event expiration time
  };
};

export const studentAuth = (email, password) => {
  return (dispatch) => {
    dispatch(studentAuthStart());

    const authData = {
      email: email,
    };

    axios
      .post("/user/login/5ecb0fd08acd9c9f242ba8c2", authData)
      .then((response) => {
        // const expirationDate = new Date(
        //   new Date().getTime() + response.data.expiresIn * 1000
        // );
        const token = response.headers["auth-token"];
        localStorage.setItem("token", token);
        // localStorage.setItem("expirationDate", expirationDate);

        axios.defaults.headers.common["auth-token"] = token; // for all requests
        dispatch(studentAuthSuccess(token));
        // dispatch(studentCheckAuthTimeout(response.data.expiresIn));
      })
      .catch((err) => {
        // console.log(err.headers);
        // dispatch(studentAuthFail(err.response.data.error));
      });
  };
};

export const setStudentAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_STUDENT_AUTH_REDIRECT_PATH,
    path: path,
  };
};

export const studentAuthCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(studentAuthSuccess(token));
      // dispatch(
      //   studentCheckAuthTimeout(
      //     (expirationDate.getTime() - new Date().getTime()) / 1000
      //   )
      // );
      // dispatch(studentLogout());
    } //else {
    // const expirationDate = new Date(localStorage.getItem("expirationDate"));
    // if (expirationDate <= new Date()) {
    //   // dispatch(studentLogout());
    // } else {
    //   const userId = localStorage.getItem("userId");
    //   dispatch(studentAuthSuccess(token, userId));
    //   dispatch(
    //     studentCheckAuthTimeout(
    //       (expirationDate.getTime() - new Date().getTime()) / 1000
    //     )
    //   );
    // }
    //}
  };
};
