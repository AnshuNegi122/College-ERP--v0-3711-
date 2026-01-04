import crypto from "crypto"
import { connectToDatabase } from "./db"
import type { Document, ObjectId } from "mongodb"

export interface User extends Document {
  _id?: ObjectId
  email: string
  name: string
  password: string
  role: "admin" | "teacher" | "student"
  classId?: ObjectId
  createdAt: Date
}

export async function hashPassword(password: string): Promise<string> {
  return crypto.createHash("sha256").update(password).digest("hex")
}

export async function createUser(
  email: string,
  name: string,
  password: string,
  role: "admin" | "teacher" | "student",
  classId?: string,
): Promise<User | null> {
  const { db } = await connectToDatabase()

  const existingUser = await db.collection("users").findOne({ email })
  if (existingUser) {
    return null // User already exists
  }

  const hashedPassword = await hashPassword(password)
  const user: User = {
    email,
    name,
    password: hashedPassword,
    role,
    classId: classId ? new (require("mongodb").ObjectId)(classId) : undefined,
    createdAt: new Date(),
  }

  const result = await db.collection("users").insertOne(user)
  return { ...user, _id: result.insertedId }
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hash = await hashPassword(password)
  return hash === hashedPassword
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const { db } = await connectToDatabase()
  return (await db.collection("users").findOne({ email })) as User | null
}

export async function findUserById(id: string): Promise<User | null> {
  const { db } = await connectToDatabase()
  const ObjectId = require("mongodb").ObjectId
  return (await db.collection("users").findOne({ _id: new ObjectId(id) })) as User | null
}
