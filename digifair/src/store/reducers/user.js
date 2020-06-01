import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

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
};

const authStart = (state, action) => {
  return updateObject(state, {
    error: null,
    eventId: action.eventId,
    loading: true,
  });
};

const studentAuthSuccess = (state, action) => {
  return updateObject(state, {
    token: action.idToken,
    credentials: action.credentials,
    isStudent: false,
    error: null,
    loading: false,
  });
};

const authFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
    isStudent: false,
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
  });
};
const authLogout = (state, action) => {
  return updateObject(state, { token: null });
};

const setAuthRedirectPath = (state, action) => {
  return updateObject(state, { authRedirectPath: action.path });
};

const studentJoinChatroomStart = (state, action) => {
  return state;
  // return updateObject(state, { authRedirectPath: action.path });
};

const studentJoinChatroomSuccess = (state, action) => {
  return updateObject(state, { credentials: action.credentials });
};

const studentJoinChatroomFail = (state, action) => {
  return updateObject(state, { error: action.error });
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

    default:
      return state;
  }
};

export default reducer;
