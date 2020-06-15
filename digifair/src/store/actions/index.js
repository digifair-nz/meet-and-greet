// Log in students
export { auth, logout, setAuthRedirectPath, authCheckState } from "./auth";

// Log in recruiters

// Fetch recruiter companies for student dashboard

export { fetchCompanies } from "./fetchCompanies";

// Queue or dequeue student
export {
  queueStudent,
  dequeueStudent,
  declineJoinChatroom,
  queueToAll,
} from "./studentQueue";

// Update student's position in queue for a specific company
export { updateQueuePosition } from "./queuePosition";

// Join student to chatroom
export { studentJoinChatroom, studentLeaveChatroom } from "./studentChatroom";

// Kick student and move sessions
export {
  kickStudent,
  inviteNextStudent,
  fetchStudentData,
} from "./recruiterChatroom";

// Clear any errors in the state
export { clearError } from "./clearError";
