import { connectToDatabase } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get("classId")
    const studentId = searchParams.get("studentId")
    const month = Number.parseInt(searchParams.get("month") || new Date().getMonth().toString())
    const year = Number.parseInt(searchParams.get("year") || new Date().getFullYear().toString())

    const ObjectId = require("mongodb").ObjectId

    const query: Record<string, any> = {}
    if (classId) query.classId = new ObjectId(classId)
    if (studentId) query.studentId = new ObjectId(studentId)

    // Get all attendance records for the month
    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0)

    query.date = {
      $gte: startDate,
      $lte: endDate,
    }

    const records = await db.collection("attendance").find(query).toArray()

    // Calculate statistics
    const stats: Record<string, any> = {}

    records.forEach((record) => {
      const key = studentId || record.classId.toString()

      if (!stats[key]) {
        stats[key] = {
          classId: record.classId,
          studentId: record.studentId,
          month,
          year,
          totalDays: new Set(),
          presentDays: 0,
          absentDays: 0,
          leaveDays: 0,
        }
      }

      // Count unique days (one record per day per student)
      const dateKey = record.date.toDateString()
      stats[key].totalDays.add(dateKey)

      if (record.status === "present") stats[key].presentDays++
      else if (record.status === "absent") stats[key].absentDays++
      else if (record.status === "leave") stats[key].leaveDays++
    })

    // Convert to array and calculate percentages
    const reports = Object.values(stats).map((stat: any) => ({
      ...stat,
      totalDays: stat.totalDays.size,
      percentage: stat.totalDays.size > 0 ? Math.round((stat.presentDays / stat.totalDays.size) * 100) : 0,
      lastUpdated: new Date(),
    }))

    return NextResponse.json(reports)
  } catch (error) {
    console.error("Attendance report error:", error)
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 })
  }
}
