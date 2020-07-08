import axios from "../../axios-instance";
import axiosPack from "axios";
import * as actionTypes from "./actionTypes";
import jwt from "jwt-decode"; // import dependency

// NOTE: Possibly refractor if there is easy reusability between student,company and club authentication process
export const authStart = (eventId, loading) => {
  return {
    type: actionTypes.AUTH_START,
    eventId: eventId,
    loading: loading,
  };
};

/**
 * studentAuthSuccess
 * @param {JWT} token of the student user
 * @param {String} name of the student user
 * @param {String} id students id (will be used for text chat creation)
 * @param {Object} credentials student's credentials for a particular session with recruiter (null if not in session)
 * @param {Object} talkJSData used for TalkJS text chat (contains AppId, name of the recruiter and id of the recruiter)
 */
export const studentAuthSuccess = (
  token,
  name,
  id,
  credentials,
  talkJSData
) => {
  return {
    type: actionTypes.STUDENT_AUTH_SUCCESS,
    idToken: token,
    credentials: credentials,
    name: name,
    id: id,
    talkJSData: talkJSData,
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
  // Only save eventId
  const eventId = localStorage.getItem("eventId");
  localStorage.clear();
  localStorage.setItem("eventId", eventId);

  window.location.reload(false);

  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const recruiterAuthSuccess = (
  token,
  name,
  id,
  credentials,
  talkJSData
) => {
  return {
    type: actionTypes.RECRUITER_AUTH_SUCCESS,
    token: token,
    name: name,
    id: id,
    credentials: credentials,
    talkJSData: talkJSData,
  };
};

/**************
EVENT FETCHING
***************/
export const fetchEvent = (eventName, expirationDate) => {
  return {
    type: actionTypes.FETCH_EVENT,
    eventName: eventName,
    expirationDate: expirationDate,
  };
};

export const auth = (eventId, email, password, isStudent) => {
  return (dispatch) => {
    dispatch(authStart(eventId, true));

    let authData = {
      email: email,
      password: password,
    };

    if (isStudent) {
      axios
        .post("/user/login/" + eventId, authData)
        .then((response) => {
          const token = response.headers["auth-token"];
          const name = jwt(token).name;
          const id = jwt(token)._id;
          const event = response.data.event;

          console.log(event);
          
          localStorage.setItem("event", JSON.stringify(event));
          localStorage.setItem("name", name);
          localStorage.setItem("id", id);
          localStorage.setItem("eventId", eventId);
          localStorage.setItem("token", token);

          dispatch(fetchEvent(event.name, event.expirationDate));
          dispatch(studentAuthSuccess(token, name, id, null, null));
        })
        .catch((err) => {
          dispatch(authFail(err.response.data));
        });
    } else {
      axios
        .post("/company/login/" + eventId, authData)
        .then((response) => {
          const token = response.headers["auth-token"];

          const credentials = response.data.credentials;
          const name = jwt(token).name;
          const id = jwt(token)._id;
          console.log(credentials);
          const event = response.data.event;
          localStorage.setItem("event", JSON.stringify(event));

          localStorage.setItem("id", id);
          localStorage.setItem("name", name);
          localStorage.setItem("eventId", eventId);
          localStorage.setItem("credentials", JSON.stringify(credentials));
          localStorage.setItem("token", token);

          dispatch(fetchEvent(event.name, event.expirationDate));

          dispatch(recruiterAuthSuccess(token, name, id, credentials, null));
        })
        .catch((err) => {
          dispatch(authFail(err.response.data));
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

// Before logging in, check if the event is still valid

// Check with the server if the eventId is valid

// If it is then auto log in

// If it's not valid because there is a newer version of the event --> fetch new event id

// else

// no event exists anymore under that version

export const checkEventIsValidStart = () => {};

// Either new event or the current event is valid
export const checkEventIsValidSuccess = () => {};

// Either server error or no event exists
export const checkEventIsValidFail = () => {};

export const authCheckState = () => {
  return (dispatch) => {
    const eventId = localStorage.getItem("eventId");

    const event = localStorage.getItem("event");

    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const id = localStorage.getItem("id");

    const credentials = localStorage.getItem("credentials");
    const talkJSData = localStorage.getItem("talkJSData");

    // get talk js data too

    let creds = null;
    if (credentials != null) {
      creds = JSON.parse(credentials);
    }

    let eventDetails = null;
    if (event) {
      eventDetails = JSON.parse(event);
    }

    let talkjsData = null;
    if (talkJSData != null) {
      talkjsData = JSON.parse(talkJSData);
    }
    // Get event id from local storage and save it to state if have any
    if (eventId != null) {
      dispatch(authStart(eventId, false));
    }

    let isStudent = true;

    if (token != null) {
      isStudent = jwt(token).accountType === "student";
    }

    if (token) {
      dispatch(fetchEvent(eventDetails.name, eventDetails.expirationDate));
      if (credentials != null) {
        if (isStudent) {
          dispatch(studentAuthSuccess(token, name, id, creds, talkjsData));
        } else {
          dispatch(recruiterAuthSuccess(token, name, id, creds, talkjsData));
        }
      } else {
        dispatch(studentAuthSuccess(token, name, id, null, talkjsData)); // only student can have no credentials at any point. Recruiter user will always be in sessions
      }
    }
  };
};
