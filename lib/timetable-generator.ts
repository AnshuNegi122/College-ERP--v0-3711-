import type { ScheduleEntry } from "@/lib/types"
import type { ObjectId } from "mongodb"

export interface TimetableInput {
  classId: ObjectId
  subjects: any[]
  sessions: any[]
  daysPerWeek?: number
  maxConsecutiveClasses?: number
}

export interface TimetableOutput {
  schedule: ScheduleEntry[]
  metadata: {
    totalPeriods: number
    totalClassPeriods: number
    subjectsBalanced: boolean
    efficiency: number
  }
}

export function generateOptimizedTimetable(input: TimetableInput): TimetableOutput {
  const { classId, subjects, sessions, daysPerWeek = 6, maxConsecutiveClasses = 2 } = input

  const schedule: ScheduleEntry[] = []
  const subjectHours: Record<string, number> = {}
  const subjectLastUsed: Record<string, number> = {}

  // Initialize tracking
  subjects.forEach((subject) => {
    subjectHours[subject._id.toString()] = subject.hours
    subjectLastUsed[subject._id.toString()] = -maxConsecutiveClasses - 1
  })

  // Generate schedule for each day
  for (let day = 0; day < daysPerWeek; day++) {
    let sessionIndex = 0
    let consecutiveCount = 0

    for (const session of sessions) {
      if (session.type === "recess" || session.type === "lunch") {
        // Add break periods
        schedule.push({
          dayOfWeek: day,
          sessionNumber: sessionIndex,
          type: session.type,
        })
        consecutiveCount = 0
      } else if (session.type === "class") {
        // Smart subject selection
        const availableSubjects = subjects
          .filter((subject) => {
            const remaining = subjectHours[subject._id.toString()] || 0
            const lastUsedGap = sessionIndex - (subjectLastUsed[subject._id.toString()] || -10)
            return remaining > 0 && lastUsedGap > maxConsecutiveClasses
          })
          .sort((a, b) => {
            // Prioritize subjects with more remaining hours
            return subjectHours[b._id.toString()] - subjectHours[a._id.toString()]
          })

        if (availableSubjects.length > 0 && consecutiveCount < maxConsecutiveClasses) {
          const selectedSubject = availableSubjects[0]

          schedule.push({
            dayOfWeek: day,
            sessionNumber: sessionIndex,
            subjectId: selectedSubject._id,
            teacherId: selectedSubject.teacher,
            type: "class",
          })

          subjectHours[selectedSubject._id.toString()]--
          subjectLastUsed[selectedSubject._id.toString()] = sessionIndex
          consecutiveCount++
        }
      }

      sessionIndex++
    }
  }

  // Calculate metadata
  const totalClassPeriods = schedule.filter((s) => s.type === "class").length
  const allSubjectsAssigned = subjects.every((subject) => subjectHours[subject._id.toString()] === 0)

  return {
    schedule,
    metadata: {
      totalPeriods: schedule.length,
      totalClassPeriods,
      subjectsBalanced: allSubjectsAssigned,
      efficiency: (totalClassPeriods / schedule.length) * 100,
    },
  }
}

export function validateTimetable(schedule: ScheduleEntry[], subjects: any[], sessions: any[]): string[] {
  const errors: string[] = []

  // Check if all subjects have at least one class
  const usedSubjects = new Set(schedule.filter((s) => s.subjectId).map((s) => s.subjectId?.toString()))

  subjects.forEach((subject) => {
    if (!usedSubjects.has(subject._id.toString())) {
      errors.push(`Subject "${subject.name}" is not assigned any periods`)
    }
  })

  // Check consecutive classes
  const maxConsecutive = 2
  for (let day = 0; day < 6; day++) {
    let consecutive = 0
    for (let session = 0; session < sessions.length; session++) {
      const entry = schedule.find((s) => s.dayOfWeek === day && s.sessionNumber === session)
      if (entry?.type === "class") {
        consecutive++
        if (consecutive > maxConsecutive) {
          errors.push(`Day ${day + 1}: More than ${maxConsecutive} consecutive classes found`)
        }
      } else {
        consecutive = 0
      }
    }
  }

  return errors
}
