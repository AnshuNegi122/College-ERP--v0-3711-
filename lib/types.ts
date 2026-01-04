import type { ObjectId } from "mongodb"

export interface Subject {
  _id?: ObjectId
  name: string
  code: string
  teacher: ObjectId
  hours: number
  createdAt?: Date
}

export interface Class {
  _id?: ObjectId
  name: string
  division: string
  strength: number
  classTeacher: ObjectId
  createdAt?: Date
}

export interface SessionConfig {
  _id?: ObjectId
  name: string
  startTime: string
  endTime: string
  duration: number // in minutes
  type: "class" | "recess" | "lunch"
  createdAt?: Date
}

export interface Timetable {
  _id?: ObjectId
  classId: ObjectId
  schedule: ScheduleEntry[]
  generatedAt: Date
  status: "draft" | "published"
}

export interface ScheduleEntry {
  dayOfWeek: number // 0-6 (Sunday-Saturday)
  sessionNumber: number
  subjectId?: ObjectId
  teacherId?: ObjectId
  roomNumber?: string
  type: "class" | "recess" | "lunch"
}

export interface AttendanceRecord {
  _id?: ObjectId
  classId: ObjectId
  date: Date
  sessionNumber: number
  dayOfWeek: number
  studentId: ObjectId
  status: "present" | "absent" | "leave"
  remarks?: string
  markedBy: ObjectId
  markedAt: Date
}

export interface AttendanceReport {
  _id?: ObjectId
  classId: ObjectId
  studentId: ObjectId
  month: number
  year: number
  totalDays: number
  presentDays: number
  absentDays: number
  leaveDays: number
  percentage: number
  lastUpdated: Date
}

export interface Course {
  _id?: ObjectId
  code: string
  name: string
  credits: number
  semester: number
  teachers: ObjectId[]
  students: ObjectId[]
  createdAt?: Date
}

export interface Grade {
  _id?: ObjectId
  studentId: ObjectId
  courseId: ObjectId
  marksObtained: number
  totalMarks: number
  percentage: number
  grade: string // A, B, C, D, F
  semester: number
  academicYear: string
  createdAt?: Date
}

export interface FeeStructure {
  _id?: ObjectId
  classId: ObjectId
  semester: number
  tuitionFee: number
  labFee: number
  activitiesFee: number
  totalFee: number
  dueDate: Date
  createdAt?: Date
}

export interface FeePayment {
  _id?: ObjectId
  studentId: ObjectId
  feeStructureId: ObjectId
  amountPaid: number
  paymentDate: Date
  paymentMethod: "online" | "offline" | "cheque"
  transactionId?: string
  status: "paid" | "pending" | "overdue"
  createdAt?: Date
}

export interface StudentProfile {
  _id?: ObjectId
  userId: ObjectId
  enrollmentNumber: string
  dateOfBirth: Date
  address: string
  phoneNumber: string
  parentName: string
  parentPhone: string
  semester: number
  gpa: number
  totalCredits: number
  academicYear: string
  createdAt?: Date
}

export interface FacultyProfile {
  _id?: ObjectId
  userId: ObjectId
  employeeId: string
  department: string
  qualification: string
  experience: number
  designation: string
  officeLocation: string
  createdAt?: Date
}

export interface Announcement {
  _id?: ObjectId
  title: string
  content: string
  postedBy: ObjectId
  targetAudience: "students" | "faculty" | "all"
  priority: "low" | "medium" | "high"
  attachmentUrl?: string
  createdAt?: Date
  expiresAt?: Date
}

export interface AssignmentSubmission {
  _id?: ObjectId
  assignmentId: ObjectId
  studentId: ObjectId
  courseId: ObjectId
  submittedFile: string
  submittedAt: Date
  marks?: number
  feedback?: string
  status: "submitted" | "graded" | "late"
}

export interface LeaveRequest {
  _id?: ObjectId
  studentId: ObjectId
  startDate: Date
  endDate: Date
  reason: string
  attachmentUrl?: string
  status: "pending" | "approved" | "rejected"
  approvedBy?: ObjectId
  approvedAt?: Date
  createdAt?: Date
}
