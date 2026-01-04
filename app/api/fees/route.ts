import { connectToDatabase } from "@/lib/db"
import { NextResponse } from "next/server"
import type { FeePayment } from "@/lib/types"

export async function GET(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")
    const status = searchParams.get("status")

    const query: Record<string, any> = {}
    if (studentId) query.studentId = require("mongodb").ObjectId(studentId)
    if (status) query.status = status

    const payments = await db.collection("fees").find(query).toArray()
    return NextResponse.json(payments)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch fees" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { studentId, feeStructureId, amountPaid, paymentMethod, transactionId } = await request.json()

    const ObjectId = require("mongodb").ObjectId

    const payment: FeePayment = {
      studentId: new ObjectId(studentId),
      feeStructureId: new ObjectId(feeStructureId),
      amountPaid,
      paymentDate: new Date(),
      paymentMethod,
      transactionId,
      status: "paid",
      createdAt: new Date(),
    }

    const result = await db.collection("fees").insertOne(payment)
    return NextResponse.json({ _id: result.insertedId, ...payment }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to record payment" }, { status: 500 })
  }
}
