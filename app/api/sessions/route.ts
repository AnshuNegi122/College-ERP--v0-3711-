import { connectToDatabase } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const sessions = await db.collection("sessions").find({}).sort({ _id: 1 }).toArray()
    return NextResponse.json(sessions)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { name, startTime, endTime, duration, type } = await request.json()

    if (!name || !startTime || !endTime || !duration || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newSession = {
      name,
      startTime,
      endTime,
      duration: Number(duration),
      type,
      createdAt: new Date(),
    }

    const result = await db.collection("sessions").insertOne(newSession)

    return NextResponse.json({ message: "Session created", sessionId: result.insertedId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}
