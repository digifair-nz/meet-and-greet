import axios from "../../axios-instance";

import * as actionTypes from "./actionTypes";

/**
 * initialize queue to a specific comapny
 * @param {string} companyId
 * @param {int} index which is the position of the company in the array
 */
export const kickStudentStart = () => {
  return {
    type: actionTypes.KICK_STUDENT_START,
  };
};

export const kickStudentSuccess = (credentials) => {
  return {
    type: actionTypes.KICK_STUDENT_SUCCESS,
    credentials: credentials,
  };
};

export const kickStudentFail = (error) => {
  return {
    type: actionTypes.KICK_STUDENT_FAIL,
    error: error,
  };
};

/**
 * The recruiter will create another session after kicking a student to prevent previous students from joining

 */
export const kickStudent = () => {
  return (dispatch) => {
    dispatch(kickStudentStart());
    // const token = localStorage.getItem("token");

    axios
      .post("/company/kick/")
      .then((response) => {
        const credentials = response.data.credentials;
        localStorage.removeItem("credentials");

        // Remove Student's credentials
        localStorage.removeItem("talkJSData");

        localStorage.setItem("credentials", JSON.stringify(credentials));
        dispatch(kickStudentSuccess(response.data.credentials));
      })
      .catch((err) => {
        dispatch(kickStudentFail(err.response.data));
      });
  };
};

export const inviteNextStudentStart = () => {
  return {
    type: actionTypes.INVITE_NEXT_STUDENT_START,
  };
};

export const inviteNextStudentSuccess = () => {
  return {
    type: actionTypes.INVITE_NEXT_STUDENT_SUCCESS,
  };
};

export const inviteNextStudentFail = (error) => {
  return {
    type: actionTypes.INVITE_NEXT_STUDENT_FAIL,
    error: error,
  };
};
/*
 * The recruiter allows for the next student to get the ready check pop up and to connect to the room
 *
 */
export const inviteNextStudent = () => {
  return (dispatch) => {
    dispatch(inviteNextStudentStart());
    // const token = localStorage.getItem("token");

    axios
      .post("/company/next/")
      .then((response) => {
        // Save the fact that the recruiter is now searching
        localStorage.setItem("searching", true);
        dispatch(inviteNextStudentSuccess());
      })
      .catch((err) => {
        console.log(err);

        dispatch(inviteNextStudentFail(err.response.data));
      });
  };
};

// If the student joins, change state searching to false
export const stopSearch = () => {
  return {
    type: actionTypes.STOP_SEARCH,
  };
};

export const fetchStudentDataStart = () => {
  return {
    type: actionTypes.FETCH_STUDENT_DATA_START,
  };
};

export const fetchStudentDataSuccess = (talkJSData) => {
  return {
    type: actionTypes.FETCH_STUDENT_DATA_SUCCESS,
    talkJSData: talkJSData,
  };
};

export const fetchStudentDataFail = (error) => {
  return {
    type: actionTypes.FETCH_STUDENT_DATA_FAIL,
    error: error,
  };
};
/*
 * This is executed when the student joins the vonage session.
 * The recruiter user will obtain the name, id and appId in order to create
 * a text chat conversation with TalkJS
 */
export const fetchStudentData = () => {
  return (dispatch) => {
    dispatch(fetchStudentDataStart());
    // const token = localStorage.getItem("token");

    axios
      .get("/company/student-details/")
      .then((response) => {
        // Get name, appId and student's id for text chat
        const talkJSData = response.data.talkJSData;
        localStorage.setItem("talkJSData", JSON.stringify(talkJSData));

        dispatch(fetchStudentDataSuccess(talkJSData));
      })
      .catch((err) => {
        console.log(err);

        dispatch(fetchStudentDataFail(err.response.data));
      });
  };
};

/*
 *
 * fetchQueuedStudents gets the number of students queued for a specific company.
 *
 *
 * This is executed on some interval or on page load.
 *
 */
export const fetchQueueLengthStart = () => {
  return {
    type: actionTypes.FETCH_QUEUE_LENGTH_START,
  };
};
export const fetchQueueLengthSuccess = (queueLength) => {
  return {
    type: actionTypes.FETCH_QUEUE_LENGTH_SUCCESS,
    queueLength: queueLength,
  };
};
export const fetchQueueLengthFail = (error) => {
  return {
    type: actionTypes.FETCH_QUEUE_LENGTH_FAIL,
    error: error,
  };
};

export const fetchQueueLength = () => {
  return (dispatch) => {
    dispatch(fetchQueueLengthStart());

    axios
      .get("/company/status")
      .then((response) => {
        //roomIsSearching -- >

        // If the recruiter is searching
        if (response.data.roomIsSearching) {
          if (!localStorage.getItem("searching")) {
            localStorage.setItem("searching", true);
            dispatch(inviteNextStudentSuccess());
          }
        }

        // If the recruiter is in session with a student
        if (response.data.roomHasSessionPartner) {
          if (!localStorage.getItem("studentConnected")) {
            localStorage.setItem("studentConnected", true);
          }
        }

        dispatch(fetchQueueLengthSuccess(response.data.queueLength));
      })
      .catch((err) => {
        console.log(err);
        dispatch(fetchQueueLengthFail(err.response.data));
      });
  };
};
