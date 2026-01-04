import { connectToDatabase } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get("id")
    const { db } = await connectToDatabase()

    if (classId) {
      const ObjectId = require("mongodb").ObjectId
      try {
        const classData = await db.collection("classes").findOne({ _id: new ObjectId(classId) })
        return NextResponse.json(classData ? [classData] : [])
      } catch {
        return NextResponse.json([])
      }
    }

    const classes = await db.collection("classes").find({}).toArray()
    return NextResponse.json(classes)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { name, division, strength, classTeacher } = await request.json()

    if (!name || !division || !strength || !classTeacher) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const ObjectId = require("mongodb").ObjectId
    const newClass = {
      name,
      division,
      strength: Number(strength),
      classTeacher: new ObjectId(classTeacher),
      createdAt: new Date(),
    }

    const result = await db.collection("classes").insertOne(newClass)

    return NextResponse.json({ message: "Class created", classId: result.insertedId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 })
  }
}
