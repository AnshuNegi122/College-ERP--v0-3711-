import { MongoClient, type Db } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const mongoUri = process.env.MONGODB_URI
  if (!mongoUri) {
    throw new Error("Please define the MONGODB_URI environment variable")
  }

  const client = new MongoClient(mongoUri)
  await client.connect()
  const db = client.db("timetable")

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export async function initializeDatabase() {
  const { db } = await connectToDatabase()

  // Create collections if they don't exist
  const collections = await db.listCollections().toArray()
  const collectionNames = collections.map((c) => c.name)

  if (!collectionNames.includes("users")) {
    await db.createCollection("users")
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
  }

  if (!collectionNames.includes("subjects")) {
    await db.createCollection("subjects")
  }

  if (!collectionNames.includes("classes")) {
    await db.createCollection("classes")
  }

  if (!collectionNames.includes("timetables")) {
    await db.createCollection("timetables")
  }

  if (!collectionNames.includes("sessions")) {
    await db.createCollection("sessions")
  }
}
