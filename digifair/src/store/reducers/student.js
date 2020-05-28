import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

// NOTE: RENAME TO STUDENT not studentAuth
const initialState = {
  token: null,

  error: null,
  loading: false,
  authRedirectPath: "/",
  companiesQueue: [
    {
      _id: "Company Id",
      hadSession: false,
      isQueued: false,
      queuePos: null,
    },
  ],
  credentials: {
    apiKey: "46721402",
    sessionId:
      "1_MX40NjcyMTQwMn5-MTU5MDYyNzc1MzE5NH5XL0lzaXExNDZJYUtjUVNiOWZSd3lCUWt-fg",
    token:
      "T1==cGFydG5lcl9pZD00NjcyMTQwMiZzaWc9ZWJkZWM4ZTc2NTI3YjY0YTQ5OWJlZjFjZmZkMDgxZDk2Zjc5YzFkYzpzZXNzaW9uX2lkPTFfTVg0ME5qY3lNVFF3TW41LU1UVTVNRFl5TnpjMU16RTVOSDVYTDBsemFYRXhORFpKWVV0alVWTmlPV1pTZDNsQ1VXdC1mZyZjcmVhdGVfdGltZT0xNTkwNjI3NzUzJnJvbGU9bW9kZXJhdG9yJm5vbmNlPTE1OTA2Mjc3NTMuMjE2NTE3NTcxNTQ3NTQ=",
  },
  // credentials: null, // this is for vonage API
};

const studentAuthStart = (state, action) => {
  return updateObject(state, { error: null, loading: true });
};

const studentAuthSuccess = (state, action) => {
  return updateObject(state, {
    token: action.idToken,

    error: null,
    loading: false,
  });
};

const studentAuthFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

const studentAuthLogout = (state, action) => {
  return updateObject(state, { token: null, userId: null });
};

const setStudentAuthRedirectPath = (state, action) => {
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
    case actionTypes.STUDENT_AUTH_START:
      return studentAuthStart(state, action);
    case actionTypes.STUDENT_AUTH_SUCCESS:
      return studentAuthSuccess(state, action);
    case actionTypes.STUDENT_AUTH_FAIL:
      return studentAuthFail(state, action);
    case actionTypes.STUDENT_AUTH_LOGOUT:
      return studentAuthLogout(state, action);
    case actionTypes.SET_STUDENT_AUTH_REDIRECT_PATH:
      return setStudentAuthRedirectPath(state, action);
    case actionTypes.STUDENT_AUTH_START:
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
