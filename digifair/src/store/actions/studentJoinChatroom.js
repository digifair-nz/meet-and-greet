import axios from "../../axios-orders";
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
        console.log(response);
        // localStorage.setItem("token", token);
        // console.log(response.data);
        dispatch(studentJoinChatroomSuccess(response.data.credentials));
      })
      .catch((err) => {
        console.log(err);

        dispatch(
          studentJoinChatroomFail("Could not connect to the company room")
        );
      });
  };
};
