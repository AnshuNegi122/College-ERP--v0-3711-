import { connectToDatabase } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const subjects = await db.collection("subjects").find({}).toArray()
    return NextResponse.json(subjects)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { name, code, teacher, hours } = await request.json()

    if (!name || !code || !teacher || !hours) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const ObjectId = require("mongodb").ObjectId
    const newSubject = {
      name,
      code,
      teacher: new ObjectId(teacher),
      hours: Number(hours),
      createdAt: new Date(),
    }

    const result = await db.collection("subjects").insertOne(newSubject)

    return NextResponse.json({ message: "Subject created", subjectId: result.insertedId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create subject" }, { status: 500 })
  }
}
