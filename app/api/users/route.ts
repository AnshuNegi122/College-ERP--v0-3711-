import { connectToDatabase } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const { db } = await connectToDatabase()

    const query: any = {}
    if (role) {
      query.role = role
    }

    const users = await db.collection("users").find(query).project({ password: 0 }).toArray()

    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
