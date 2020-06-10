import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";
import { fetchCompaniesStart } from "../actions/fetchCompanies";
import { fetchStudentData } from "../actions";

// NOTE: RENAME TO STUDENT not studentAuth
const initialState = {
  token: null,

  error: null,
  loading: false,
  authRedirectPath: "/",

  // credentials: {
  //   apiKey: "46721402",
  //   sessionId:
  //     "1_MX40NjcyMTQwMn5-MTU5MDYyNzc1MzE5NH5XL0lzaXExNDZJYUtjUVNiOWZSd3lCUWt-fg",
  //   token:
  //     "T1==cGFydG5lcl9pZD00NjcyMTQwMiZzaWc9ZWJkZWM4ZTc2NTI3YjY0YTQ5OWJlZjFjZmZkMDgxZDk2Zjc5YzFkYzpzZXNzaW9uX2lkPTFfTVg0ME5qY3lNVFF3TW41LU1UVTVNRFl5TnpjMU16RTVOSDVYTDBsemFYRXhORFpKWVV0alVWTmlPV1pTZDNsQ1VXdC1mZyZjcmVhdGVfdGltZT0xNTkwNjI3NzUzJnJvbGU9bW9kZXJhdG9yJm5vbmNlPTE1OTA2Mjc3NTMuMjE2NTE3NTcxNTQ3NTQ=",
  // },
  credentials: null, // this is for vonage API
  isStudent: true,
  eventId: null,
  //allowNextUser: null,
  name: null,
  id: null,
  talkJSData: null,
};

const authStart = (state, action) => {
  console.log(state);
  // console.log(action.eventId);
  return updateObject(state, {
    error: null,
    eventId: action.eventId,
    loading: action.loading,
  });
};

const studentAuthSuccess = (state, action) => {
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

const studentJoinChatroomStart = (state, action) => {
  return state;
  // return updateObject(state, { authRedirectPath: action.path });
};

const studentJoinChatroomSuccess = (state, action) => {
  return updateObject(state, {
    credentials: action.credentials,
    talkJSData: action.talkJSData,
  });
};

const studentJoinChatroomFail = (state, action) => {
  return updateObject(state, { error: action.error });
};

const studentLeaveSession = (state, action) => {
  return updateObject(state, { credentials: null, talkJSData: null });
};

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
  });
};

const recruiterInviteNextFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.error,
  });
};

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

const reducer = (state = initialState, action) => {
  switch (action.type) {
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
    case actionTypes.STUDENT_JOIN_CHATROOM_START:
      return studentJoinChatroomStart(state, action);
    case actionTypes.STUDENT_JOIN_CHATROOM_SUCCESS:
      return studentJoinChatroomSuccess(state, action);
    case actionTypes.STUDENT_JOIN_CHATROOM_FAIL:
      return studentJoinChatroomFail(state, action);
    case actionTypes.STUDENT_LEAVE_SESSION:
      return studentLeaveSession(state, action);
    case actionTypes.KICK_STUDENT_START:
      return recruiterKickStudentStart(state, action);
    case actionTypes.KICK_STUDENT_SUCCESS:
      return recruiterKickStudentSuccess(state, action);
    case actionTypes.KICK_STUDENT_FAIL:
      return recruiterKickStudentFail(state, action);
    case actionTypes.INVITE_NEXT_STUDENT_START:
      return recruiterInviteNextStart(state, action);
    case actionTypes.INVITE_NEXT_STUDENT_START:
      return recruiterInviteNextSuccess(state, action);
    case actionTypes.INVITE_NEXT_STUDENT_FAIL:
      return recruiterInviteNextFail(state, action);
    case actionTypes.FETCH_STUDENT_DATA_START:
      return fetchStudentDataStart(state, action);
    case actionTypes.FETCH_STUDENT_DATA_SUCCESS:
      return fetchStudentDataSuccess(state, action);
    case actionTypes.FETCH_STUDENT_DATA_FAIL:
      return fetchStudentDataFail(state, action);
    default:
      return state;
  }
};

export default reducer;
