import { connectToDatabase } from "@/lib/db"
import { NextResponse } from "next/server"
import type { Grade } from "@/lib/types"

export async function GET(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")
    const courseId = searchParams.get("courseId")
    const semester = searchParams.get("semester")

    const query: Record<string, any> = {}
    if (studentId) query.studentId = require("mongodb").ObjectId(studentId)
    if (courseId) query.courseId = require("mongodb").ObjectId(courseId)
    if (semester) query.semester = Number.parseInt(semester)

    const grades = await db.collection("grades").find(query).toArray()
    return NextResponse.json(grades)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch grades" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { studentId, courseId, marksObtained, totalMarks, semester, academicYear } = await request.json()

    const ObjectId = require("mongodb").ObjectId
    const percentage = (marksObtained / totalMarks) * 100
    const gradeMap: Record<number, string> = {
      90: "A+",
      80: "A",
      70: "B+",
      60: "B",
      50: "C",
      40: "D",
      0: "F",
    }
    const grade = Object.entries(gradeMap).find(([threshold]) => percentage >= Number(threshold))?.[1] || "F"

    const gradeRecord: Grade = {
      studentId: new ObjectId(studentId),
      courseId: new ObjectId(courseId),
      marksObtained,
      totalMarks,
      percentage: Math.round(percentage * 100) / 100,
      grade,
      semester,
      academicYear,
      createdAt: new Date(),
    }

    const result = await db.collection("grades").insertOne(gradeRecord)
    return NextResponse.json({ _id: result.insertedId, ...gradeRecord }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create grade" }, { status: 500 })
  }
}
