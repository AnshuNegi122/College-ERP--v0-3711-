import { connectToDatabase } from "@/lib/db"
import { NextResponse } from "next/server"
import type { ScheduleEntry } from "@/lib/types"

function generateTimetable(classId: string, subjects: any[], sessions: any[], daysPerWeek = 6) {
  const ObjectId = require("mongodb").ObjectId
  const classObjectId = new ObjectId(classId)

  // Create schedule entries for the week
  const schedule: ScheduleEntry[] = []

  // Track subject hours allocated
  const subjectHours: Record<string, number> = {}
  subjects.forEach((subject) => {
    subjectHours[subject._id.toString()] = subject.hours
  })

  // Generate schedule for each day
  for (let day = 0; day < daysPerWeek; day++) {
    let sessionIndex = 0

    for (const session of sessions) {
      if (session.type === "recess" || session.type === "lunch") {
        // Add recess/lunch periods
        schedule.push({
          dayOfWeek: day,
          sessionNumber: sessionIndex,
          type: session.type,
        })
      } else if (session.type === "class") {
        // Find subject with remaining hours
        const availableSubject = subjects.find((subject) => subjectHours[subject._id.toString()] > 0)

        if (availableSubject) {
          schedule.push({
            dayOfWeek: day,
            sessionNumber: sessionIndex,
            subjectId: new ObjectId(availableSubject._id),
            teacherId: new ObjectId(availableSubject.teacher),
            type: "class",
          })

          subjectHours[availableSubject._id.toString()]--
        }
      }

      sessionIndex++
    }
  }

  return schedule
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { classId, daysPerWeek = 6 } = await request.json()

    if (!classId) {
      return NextResponse.json({ error: "Missing classId" }, { status: 400 })
    }

    const ObjectId = require("mongodb").ObjectId

    // Fetch subjects and sessions
    const subjects = await db.collection("subjects").find({}).toArray()
    const sessions = await db.collection("sessions").find({}).sort({ _id: 1 }).toArray()

    if (subjects.length === 0 || sessions.length === 0) {
      return NextResponse.json({ error: "No subjects or sessions configured" }, { status: 400 })
    }

    // Generate timetable
    const schedule = generateTimetable(classId, subjects, sessions, daysPerWeek)

    // Save timetable to database
    const timetable = {
      classId: new ObjectId(classId),
      schedule,
      generatedAt: new Date(),
      status: "draft",
    }

    const result = await db.collection("timetables").insertOne(timetable)

    return NextResponse.json(
      {
        message: "Timetable generated successfully",
        timetableId: result.insertedId,
        schedule,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Timetable generation error:", error)
    return NextResponse.json({ error: "Failed to generate timetable" }, { status: 500 })
  }
}
