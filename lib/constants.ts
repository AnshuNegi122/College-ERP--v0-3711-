export const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export const SESSION_TYPES = [
  { value: "class", label: "Class" },
  { value: "recess", label: "Recess" },
  { value: "lunch", label: "Lunch Break" },
]

export const ROLES = [
  { value: "admin", label: "Administrator" },
  { value: "teacher", label: "Teacher" },
  { value: "student", label: "Student" },
]

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
  },
  CLASSES: {
    GET_ALL: "/api/classes",
    CREATE: "/api/classes",
  },
  SUBJECTS: {
    GET_ALL: "/api/subjects",
    CREATE: "/api/subjects",
  },
  SESSIONS: {
    GET_ALL: "/api/sessions",
    CREATE: "/api/sessions",
  },
  TIMETABLES: {
    GET_ALL: "/api/timetables",
    GENERATE: "/api/timetables/generate",
    UPDATE: "/api/timetables",
  },
  USERS: {
    GET_ALL: "/api/users",
  },
}
