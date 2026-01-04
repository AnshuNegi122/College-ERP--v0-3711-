import { connectToDatabase } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { classId, date, sessionNumber, dayOfWeek, attendance, markedBy } = await request.json()

    const ObjectId = require("mongodb").ObjectId

    const records = attendance.map((record: any) => ({
      classId: new ObjectId(classId),
      date: new Date(date),
      sessionNumber,
      dayOfWeek,
      studentId: new ObjectId(record.studentId),
      status: record.status,
      remarks: record.remarks || "",
      markedBy: new ObjectId(markedBy),
      markedAt: new Date(),
    }))

    const result = await db.collection("attendance").insertMany(records)

    return NextResponse.json(
      {
        message: "Attendance marked successfully",
        insertedCount: result.insertedCount,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Bulk attendance error:", error)
    return NextResponse.json({ error: "Failed to mark attendance" }, { status: 500 })
  }
}
