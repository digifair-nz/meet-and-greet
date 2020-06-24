// Event fetching
export const FETCH_EVENT = "FETCH_EVENT";

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

// Queue to all companies
export const QUEUE_TO_ALL_START = "QUEUE_TO_ALL_START";
export const QUEUE_TO_ALL_SUCCESS = "QUEUE_TO_ALL_SUCCESS";
export const QUEUE_TO_ALL_FAIL = "QUEUE_TO_ALL_FAIL";

// Dequeue to all companies
export const DEQUEUE_FROM_ALL_START = "DEQUEUE_FROM_ALL_START";
export const DEQUEUE_FROM_ALL_SUCCESS = "DEQUEUE_FROM_ALL_SUCCESS";
export const DEQUEUE_FROM_ALL_FAIL = "DEQUEUE_FROM_ALL_FAIL";

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

// Recruiter Kick student from the session
export const KICK_STUDENT_START = "KICK_STUDENT_START";
export const KICK_STUDENT_SUCCESS = "KICK_STUDENT_SUCCESS";
export const KICK_STUDENT_FAIL = "KICK_STUDENT_FAIL";

// Recruiter invites next user
export const INVITE_NEXT_STUDENT_START = "INVITE_NEXT_STUDENT_START";
export const INVITE_NEXT_STUDENT_SUCCESS = "INVITE_NEXT_STUDENT_SUCCESS";
export const INVITE_NEXT_STUDENT_FAIL = "INVITE_NEXT_STUDENT_FAIL";

// Recruiter fetches student data for the text chat
export const FETCH_STUDENT_DATA_START = "FETCH_STUDENT_DATA_START";
export const FETCH_STUDENT_DATA_SUCCESS = "FETCH_STUDENT_DATA_SUCCESS";
export const FETCH_STUDENT_DATA_FAIL = "FETCH_STUDENT_DATA_FAIL";

// Recruiter fetch number of students queued
export const FETCH_QUEUED_STUDENTS_NUM_START =
  "FETCH_QUEUED_STUDENTS_NUM_START";
export const FETCH_QUEUED_STUDENTS_NUM_SUCCESS =
  "FETCH_QUEUED_STUDENTS_NUM_SUCCESS";
export const FETCH_QUEUED_STUDENTS_NUM_FAIL = " FETCH_QUEUED_STUDENTS_NUM_FAIL";

// Student Leave Session
export const STUDENT_LEAVE_CHATROOM_START = "STUDENT_LEAVE_CHATROOM_START";
export const STUDENT_LEAVE_CHATROOM_SUCCESS = "STUDENT_LEAVE_CHATROOM_SUCCESS";
export const STUDENT_LEAVE_CHATROOM_FAIL = "STUDENT_LEAVE_CHATROOM_FAIL";

// Clear error
export const CLEAR_ERROR = "CLEAR_ERROR";
