// Authentication for Companies

// Authentication for students
export const AUTH_START = "AUTH_START";
export const STUDENT_AUTH_SUCCESS = "STUDENT_AUTH_SUCCESS";
export const AUTH_FAIL = "AUTH_FAIL";
export const AUTH_LOGOUT = "AUTH_LOGOUT";

// Authentication for recruiters

export const RECRUITER_AUTH_SUCCESS = "RECRUITER_AUTH_SUCCESS";

// Redirected if logged in
export const SET_AUTH_REDIRECT_PATH = "SET_AUTH_REDIRECT_PATH";

// Fetch Companies for student dashboard
export const FETCH_COMPANIES_START = "FETCH_COMPANIES_START";

export const FETCH_COMPANIES_SUCCESS = "FETCH_COMPANIES_SUCCESS";
export const FETCH_COMPANIES_FAIL = "FETCH_COMPANIES_FAIL";

// Student INFO

// Queue Position update
export const UPDATE_QUEUE_POSITION = "UPDATE_QUEUE_POSITION";

// Queue Student to a Company
export const QUEUE_INIT = "QUEUE_INIT";
export const QUEUE_SUCCESS = "QUEUE_SUCCESS";
export const QUEUE_FAIL = "QUEUE_FAIL";

// Dequeue Student from a Company
export const DEQUEUE_INIT = "DEQUEUE_INIT";
export const DEQUEUE_SUCCESS = "DEQUEUE_SUCCESS";
export const DEQUEUE_FAIL = "DEQUEUE_FAIL";

// Student Join Chat room (student to recruiter)
export const STUDENT_JOIN_CHATROOM_START = "STUDENT_JOIN_CHATROOM_START";
export const STUDENT_JOIN_CHATROOM_SUCCESS = "STUDENT_JOIN_CHATROOM_SUCCESS";
export const STUDENT_JOIN_CHATROOM_FAIL = "STUDENT_JOIN_CHATROOM_FAIL";

// Company Kick student from the session
export const COMPANY_KICK_STUDENT_START = "COMPANY_KICK_STUDENT_START";
export const COMPANY_KICK_STUDENT_SUCCESS = "COMPANY_KICK_STUDENT_SUCCESS";
export const COMPANY_KICK_STUDENT_FAIL = "COMPANY_KICK_STUDENT_FAIL";

// Student Leave Session
export const STUDENT_LEAVE_SESSION = "STUDENT_LEAVE_SESSION";
//export const STUDENT_LEAVE_SESSION_SUCCESS = "STUDENT_LEAVE_SESSION_SUCCESS";
//export const STUDENT_LEAVE_SESSION_FAIL = "STUDENT_LEAVE_SESSION_FAIL";

// Clear error
export const CLEAR_ERROR = "CLEAR_ERROR";
