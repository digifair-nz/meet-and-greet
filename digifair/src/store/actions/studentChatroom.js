import axios from "../../axios-instance";
import * as actionTypes from "./actionTypes";

// /**
//  * initialize queue to a specific comapny
//  * @param {string} companyId
//  * @param {int} queuePosition the current position of the student in the specific company's queue
//  *
//  */

export const studentJoinChatroomStart = () => {
  // Expect to be called when a message is sent from the socket connection
  return {
    type: actionTypes.STUDENT_JOIN_CHATROOM_START,
  };
};

export const studentJoinChatroomSuccess = (credentials, talkJSData) => {
  // Expect to be called when a message is sent from the socket connection
  return {
    type: actionTypes.STUDENT_JOIN_CHATROOM_SUCCESS,
    credentials: credentials,
    talkJSData: talkJSData,
  };
};

export const studentJoinChatroomFail = (error) => {
  // Expect to be called when a message is sent from the socket connection
  return {
    type: actionTypes.STUDENT_JOIN_CHATROOM_FAIL,
    error: error,
  };
};

export const studentJoinChatroom = (companyId) => {
  return (dispatch) => {
    dispatch(studentJoinChatroomStart());

    axios
      .post("/user/accept/" + companyId)
      .then((response) => {
        //console.log(response);
        const credentials = response.data.credentials;
        console.log(credentials);
        // console.log(credentials);
        // Save credentials to local storage
        const talkJSData = response.data.talkJSData;
        // expect recruiter talkJS data
        console.log(talkJSData);
        // extract talkJSdata and save the object in local storage
        localStorage.setItem("talkJSData", JSON.stringify(talkJSData));
        //Don't forget to retrieve data from auth check state

        localStorage.setItem("credentials", JSON.stringify(credentials));

        dispatch(studentJoinChatroomSuccess(credentials, talkJSData));
      })
      .catch((err) => {
        console.log(err);

        dispatch(studentJoinChatroomFail(err.response.data));
      });
  };
};

export const studentLeaveSession = () => {
  // Clear credentials
  localStorage.removeItem("credentials");
  localStorage.removeItem("talkJSData");

  return {
    type: actionTypes.STUDENT_LEAVE_SESSION,
  };
};

// export const studentChatRoomRedirect
// Check if student users have chat room credentials in case they refrehsed the page or closed the tab
// export const studentCheckCredentials = () => {
//   return (dispatch) => {
//     const credentials = localStorage.getItem("credentials");
//     if (credentials) {
//       dispatch(studentJoinChatroomSuccess(credentials));
//     }
//   };
// };
