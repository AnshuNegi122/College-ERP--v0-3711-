import { createUser } from "@/lib/auth"
import { initializeDatabase } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    await initializeDatabase()
    const { email, name, password, role, classId } = await request.json()

    if (!email || !name || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const user = await createUser(email, name, password, role, classId)

    if (!user) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    return NextResponse.json({ message: "User created successfully", userId: user._id }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
