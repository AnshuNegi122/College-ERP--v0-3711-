import { connectToDatabase } from "@/lib/db"
import { NextResponse } from "next/server"
import type { Announcement } from "@/lib/types"

export async function GET(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const targetAudience = searchParams.get("audience")

    const query: Record<string, any> = {}
    if (targetAudience) {
      query.targetAudience = { $in: [targetAudience, "all"] }
    }

    const announcements = await db.collection("announcements").find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(announcements)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { title, content, postedBy, targetAudience, priority, attachmentUrl, expiresAt } = await request.json()

    const ObjectId = require("mongodb").ObjectId

    const announcement: Announcement = {
      title,
      content,
      postedBy: new ObjectId(postedBy),
      targetAudience,
      priority,
      attachmentUrl,
      createdAt: new Date(),
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    }

    const result = await db.collection("announcements").insertOne(announcement)
    return NextResponse.json({ _id: result.insertedId, ...announcement }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 })
  }
}
