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
