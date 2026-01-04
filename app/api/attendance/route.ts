import { connectToDatabase } from "@/lib/db"
import { NextResponse } from "next/server"
import type { AttendanceRecord } from "@/lib/types"

export async function GET(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get("classId")
    const date = searchParams.get("date")
    const studentId = searchParams.get("studentId")

    const query: Record<string, any> = {}
    if (classId) query.classId = require("mongodb").ObjectId(classId)
    if (date) query.date = new Date(date)
    if (studentId) query.studentId = require("mongodb").ObjectId(studentId)

    const records = await db.collection("attendance").find(query).toArray()
    return NextResponse.json(records)
  } catch (error) {
    console.error("Fetch attendance error:", error)
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { classId, date, sessionNumber, dayOfWeek, studentId, status, remarks, markedBy } = await request.json()

    const ObjectId = require("mongodb").ObjectId

    const record: AttendanceRecord = {
      classId: new ObjectId(classId),
      date: new Date(date),
      sessionNumber,
      dayOfWeek,
      studentId: new ObjectId(studentId),
      status,
      remarks,
      markedBy: new ObjectId(markedBy),
      markedAt: new Date(),
    }

    const result = await db.collection("attendance").insertOne(record)
    return NextResponse.json({ _id: result.insertedId, ...record }, { status: 201 })
  } catch (error) {
    console.error("Create attendance error:", error)
    return NextResponse.json({ error: "Failed to create attendance record" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { attendanceId, status, remarks } = await request.json()

    const ObjectId = require("mongodb").ObjectId

    const result = await db.collection("attendance").updateOne(
      { _id: new ObjectId(attendanceId) },
      {
        $set: {
          status,
          remarks,
          markedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Attendance record not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Attendance updated successfully" })
  } catch (error) {
    console.error("Update attendance error:", error)
    return NextResponse.json({ error: "Failed to update attendance" }, { status: 500 })
  }
}
