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

export const studentJoinChatroomSuccess = (credentials) => {
  // Expect to be called when a message is sent from the socket connection
  return {
    type: actionTypes.STUDENT_JOIN_CHATROOM_SUCCESS,
    credentials: credentials,
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
        // console.log(credentials);
        // Save credentials to local storage

        localStorage.setItem("credentials", JSON.stringify(credentials));

        dispatch(studentJoinChatroomSuccess(credentials));
      })
      .catch((err) => {
        console.log(err);

        dispatch(
          studentJoinChatroomFail("Could not connect to the company room")
        );
      });
  };
};

export const studentLeaveSession = () => {
  // Clear credentials
  localStorage.removeItem("credentials");

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
