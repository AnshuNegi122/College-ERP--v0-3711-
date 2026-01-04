import { connectToDatabase } from "@/lib/db"
import { NextResponse } from "next/server"
import type { LeaveRequest } from "@/lib/types"

export async function GET(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")
    const status = searchParams.get("status")

    const query: Record<string, any> = {}
    if (studentId) query.studentId = require("mongodb").ObjectId(studentId)
    if (status) query.status = status

    const requests = await db.collection("leaveRequests").find(query).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(requests)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leave requests" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { studentId, startDate, endDate, reason, attachmentUrl } = await request.json()

    const ObjectId = require("mongodb").ObjectId

    const leaveRequest: LeaveRequest = {
      studentId: new ObjectId(studentId),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      attachmentUrl,
      status: "pending",
      createdAt: new Date(),
    }

    const result = await db.collection("leaveRequests").insertOne(leaveRequest)
    return NextResponse.json({ _id: result.insertedId, ...leaveRequest }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit leave request" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { requestId, status, approvedBy } = await request.json()

    const ObjectId = require("mongodb").ObjectId

    const result = await db.collection("leaveRequests").updateOne(
      { _id: new ObjectId(requestId) },
      {
        $set: {
          status,
          approvedBy: approvedBy ? new ObjectId(approvedBy) : null,
          approvedAt: status === "approved" || status === "rejected" ? new Date() : null,
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Leave request not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Leave request updated" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update leave request" }, { status: 500 })
  }
}
