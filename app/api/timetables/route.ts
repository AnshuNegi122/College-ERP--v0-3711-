import { connectToDatabase } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get("classId")
    const { db } = await connectToDatabase()

    const query: any = {}
    if (classId) {
      const ObjectId = require("mongodb").ObjectId
      query.classId = new ObjectId(classId)
    }

    const timetables = await db.collection("timetables").find(query).toArray()

    return NextResponse.json(timetables)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch timetables" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { timetableId, status } = await request.json()
    const ObjectId = require("mongodb").ObjectId

    const result = await db.collection("timetables").updateOne({ _id: new ObjectId(timetableId) }, { $set: { status } })

    return NextResponse.json({ message: "Timetable updated", modifiedCount: result.modifiedCount }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update timetable" }, { status: 500 })
  }
}
