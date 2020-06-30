import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";
import { fetchQueuedStudentsNum } from "../actions/recruiterChatroom";

/*

This reducer is responsible for the user slice of the state 
which includes the recruiter and the student.

It contains information necessary to move the user between chatrooms 
which means it is managing kicking students, inviting students, leaving sessions,
fetching data, and signing in and signing out.

*/
const initialState = {
  token: null,

  error: null,
  loading: false,
  authRedirectPath: "/",
  credentials: null, // this is for vonage API
  isStudent: true,
  eventId: null,
  name: null,
  id: null,
  talkJSData: null, // for text chat (talk js)
  searching: false,
  queueLength: null, // for recruiters --> Displays number of students queued for their company
};

/***********************************************
                 AUTHENTICATION             
***********************************************/

const authStart = (state, action) => {
  // console.log(action.eventId);
  return updateObject(state, {
    error: null,
    eventId: action.eventId,
    loading: action.loading,
  });
};

const studentAuthSuccess = (state, action) => {
  console.log(state);
  return updateObject(state, {
    token: action.idToken,
    credentials: action.credentials,
    isStudent: true,
    error: null,
    loading: false,
    name: action.name,
    id: action.id,
    talkJSData: action.talkJSData,
  });
};

const authFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
    //isStudent: false,
  });
};

const recruiterAuthSuccess = (state, action) => {
  return updateObject(state, {
    token: action.token,
    credentials: action.credentials,
    isStudent: false,
    loading: false,
    error: null,
    authRedirectPath: "/chat-room",
    name: action.name,
    id: action.id,
    talkJSData: action.talkJSData,
  });
};
const authLogout = (state, action) => {
  return updateObject(state, {
    credentials: null,
    token: null,
    loading: false,
    talkJSData: null,
    name: null,
    isStudent: true,
    id: null,
  });
};

const setAuthRedirectPath = (state, action) => {
  return updateObject(state, { authRedirectPath: action.path });
};

/***********************************************
                STUDENT CHATROOM            
***********************************************/

// Joining chatroom

const studentJoinChatroomStart = (state, action) => {
  return updateObject(state, { loading: true });
  // return updateObject(state, { authRedirectPath: action.path });
};

const studentJoinChatroomSuccess = (state, action) => {
  return updateObject(state, {
    credentials: action.credentials,
    talkJSData: action.talkJSData,
    loading: false,
  });
};

const studentJoinChatroomFail = (state, action) => {
  return updateObject(state, { error: action.error, loading: false });
};

// leaving chatroom

const studentLeaveChatroomStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const studentLeaveChatroomSuccess = (state, action) => {
  return updateObject(state, {
    credentials: null,
    talkJSData: null,
    loading: false,
  });
};

const studentLeaveChatroomFail = (state, action) => {
  return updateObject(state, {
    credentials: null,
    talkJSData: null,
    loading: false,
  });
};

/***********************************************
                RECRUITER CHATROOM            
***********************************************/
const recruiterKickStudentStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const recruiterKickStudentSuccess = (state, action) => {
  return updateObject(state, {
    credentials: action.credentials,
    loading: false,
  });
};

const recruiterKickStudentFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.error,
  });
};

const recruiterInviteNextStart = (state, action) => {
  return updateObject(state, {
    loading: true,
  });
};

const recruiterInviteNextSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    searching: true,
  });
};

const recruiterInviteNextFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.error,
    searching: false,
  });
};

// Fetching TalkJS details when the student connects (name, id, appId etc.)
const fetchStudentDataStart = (state, action) => {
  return updateObject(state, {
    loading: true,
  });
};

const fetchStudentDataSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    talkJSData: action.talkJSData,
  });
};

const fetchStudentDataFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.error,
  });
};

// Fetching the number of students queued for the recruiter's specific company

const fetchQueuedStudentsNumStart = (state, action) => {
  return state;
};

const fetchQueuedStudentsNumSuccess = (state, action) => {
  return updateObject(state, {
    queueLength: action.queueLength,
  });
};

const fetchQueuedStudentsNumFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    //--------- AUTHENTICATION ----------------
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.STUDENT_AUTH_SUCCESS:
      return studentAuthSuccess(state, action);
    case actionTypes.RECRUITER_AUTH_SUCCESS:
      return recruiterAuthSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);
    case actionTypes.SET_AUTH_REDIRECT_PATH:
      return setAuthRedirectPath(state, action);
    //--------- STUDENT JOINING THE CHATROOM ----------------
    case actionTypes.STUDENT_JOIN_CHATROOM_START:
      return studentJoinChatroomStart(state, action);
    case actionTypes.STUDENT_JOIN_CHATROOM_SUCCESS:
      return studentJoinChatroomSuccess(state, action);
    case actionTypes.STUDENT_JOIN_CHATROOM_FAIL:
      return studentJoinChatroomFail(state, action);
    //--------- STUDENT LEAVING THE CHATROOM ----------------
    case actionTypes.STUDENT_LEAVE_CHATROOM_START:
      return studentLeaveChatroomStart(state, action);
    case actionTypes.STUDENT_LEAVE_CHATROOM_SUCCESS:
      return studentLeaveChatroomSuccess(state, action);
    case actionTypes.STUDENT_LEAVE_CHATROOM_FAIL:
      return studentLeaveChatroomFail(state, action);
    //--------- RECRUITER KICKING ----------------
    case actionTypes.KICK_STUDENT_START:
      return recruiterKickStudentStart(state, action);
    case actionTypes.KICK_STUDENT_SUCCESS:
      return recruiterKickStudentSuccess(state, action);
    case actionTypes.KICK_STUDENT_FAIL:
      return recruiterKickStudentFail(state, action);
    //--------- RECRUITER INVITING NEXT USER ----------------
    case actionTypes.INVITE_NEXT_STUDENT_START:
      return recruiterInviteNextStart(state, action);
    case actionTypes.INVITE_NEXT_STUDENT_SUCCESS:
      return recruiterInviteNextSuccess(state, action);
    case actionTypes.INVITE_NEXT_STUDENT_FAIL:
      return recruiterInviteNextFail(state, action);
    case actionTypes.STOP_SEARCH:
      return updateObject(state, {
        searching: false,
      });
    //--------- RECRUITER GETTING STUDENT'S INFORMATION ----------------
    case actionTypes.FETCH_STUDENT_DATA_START:
      return fetchStudentDataStart(state, action);
    case actionTypes.FETCH_STUDENT_DATA_SUCCESS:
      return fetchStudentDataSuccess(state, action);
    case actionTypes.FETCH_STUDENT_DATA_FAIL:
      return fetchStudentDataFail(state, action);
    case actionTypes.CLEAR_ERROR:
      return updateObject(state, { error: null });
    //--------- RECRUITER GETTING NUMBER OF STUDENTS QUEUED FOR THEIR COMPANY ----------------
    case actionTypes.FETCH_QUEUE_LENGTH_START:
      return fetchQueuedStudentsNumStart(state, action);
    case actionTypes.FETCH_QUEUE_LENGTH_SUCCESS:
      return fetchQueuedStudentsNumSuccess(state, action);
    case actionTypes.FETCH_QUEUE_LENGTH_FAIL:
      return fetchQueuedStudentsNumFail(state, action);

    default:
      return state;
  }
};

export default reducer;
