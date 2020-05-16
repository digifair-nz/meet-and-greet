import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

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
    default:
      return state;
  }
};

export default reducer;
