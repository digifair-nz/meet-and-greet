import axios from "../../axios-instance";

import * as actionTypes from "./actionTypes";
import jwt from "jwt-decode"; // import dependency

// NOTE: Possibly refractor if there is easy reusability between student,company and club authentication process
export const authStart = (eventId) => {
  return {
    type: actionTypes.AUTH_START,
    eventId: eventId,
  };
};

export const studentAuthSuccess = (token, credentials) => {
  return {
    type: actionTypes.STUDENT_AUTH_SUCCESS,
    idToken: token,
    credentials: credentials,
  };
};
//
export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("credentials");

  // localStorage.removeItem("expirationDate");

  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const recruiterAuthSuccess = (token, credentials) => {
  return {
    type: actionTypes.RECRUITER_AUTH_SUCCESS,
    token: token,
    credentials: credentials,
  };
};

export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    // setTimeout(() => {
    //   // dispatch(studentLogout());
    // }, expirationTime * 1000); // Expiration time should be based on the event expiration time
  };
};

export const auth = (eventId, email, password, isStudent) => {
  return (dispatch) => {
    dispatch(authStart(eventId));

    const authData = {
      email: email,
    };

    if (isStudent) {
      axios
        .post("/user/login/" + eventId, authData)
        .then((response) => {
          // const expirationDate = new Date(
          //   new Date().getTime() + response.data.expiresIn * 1000
          // );
          const token = response.headers["auth-token"];
          localStorage.setItem("token", token);
          // localStorage.setItem("expirationDate", expirationDate);

          //axios.defaults.headers.common["auth-token"] = token; // for all requests
          dispatch(studentAuthSuccess(token, null));
          // dispatch(studentCheckAuthTimeout(response.data.expiresIn));
        })
        .catch((err) => {
          // console.log(err.headers);
          dispatch(authFail(err));
        });
    } else {
      axios
        .post("/company/login/" + eventId, authData)
        .then((response) => {
          // console.log(response);
          const token = response.headers["auth-token"];

          const credentials = response.data.credentials;
          localStorage.setItem("credentials", JSON.stringify(credentials));
          localStorage.setItem("token", token);

          dispatch(recruiterAuthSuccess(token, credentials));
          // dispatch(recruiterCheckAuthTimeout(response.data.expiresIn));
        })
        .catch((err) => {
          // console.log(err.headers);
          console.log(err);
          dispatch(authFail(err));
        });
    }
  };
};

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path,
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");

    let isStudent = true;

    if (token != null) {
      isStudent = jwt(token).accountType === "student";
      // console.log(decodedToken);
    }

    const credentials = localStorage.getItem("credentials");
    const creds = JSON.parse(credentials);
    // console.log(creds);

    if (token) {
      if (credentials != null) {
        if (isStudent) {
          dispatch(studentAuthSuccess(token, creds));
        } else {
          dispatch(recruiterAuthSuccess(token, creds));
        }
      } else {
        dispatch(studentAuthSuccess(token, null)); // only student can have no credentials at any point. Recruiter user will always be in sessions
      }

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
