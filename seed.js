import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" }
});

/* ------------------ HELPERS ------------------ */
async function safePost(url, payload, label = "") {
  try {
    return await api.post(url, payload);
  } catch (err) {
    if (err.response?.status === 409) {
      console.log(`⚠️ Skipped ${label} (already exists)`);
      return null;
    }
    throw err;
  }
}

async function getFirstUserByRole(role) {
  const res = await api.get(`/users?role=${role}`);
  if (!res.data.length) throw new Error(`No ${role} found`);
  return res.data[0]._id;
}

/* ------------------ SEED ------------------ */
async function seed() {
  try {
    console.log("🚀 Seeding started...\n");

    /* ========== USERS ========== */
    console.log("👤 Creating users...");
    await safePost("/auth/register", {
      name: "Admin User",
      email: "admin@test.com",
      password: "123456",
      role: "admin"
    }, "admin");

    await safePost("/auth/register", {
      name: "Teacher One",
      email: "teacher@test.com",
      password: "123456",
      role: "teacher"
    }, "teacher");

    /* Fetch required user IDs */
    const teacherId = await getFirstUserByRole("teacher");

    /* ========== CLASS ========== */
    console.log("🏫 Creating class...");
    const classRes = await safePost("/classes", {
      name: "B.Tech CSE",
      division: "A",
      strength: 60,
      classTeacher: teacherId
    }, "class");

    const classId = classRes?.data?._id;

    /* ========== SUBJECTS ========== */
    console.log("📚 Creating subjects...");
    const subjects = [
      { name: "Data Structures", code: "CS301", hours: 4 },
      { name: "Operating Systems", code: "CS302", hours: 3 },
      { name: "DBMS", code: "CS303", hours: 3 }
    ];

    const subjectIds = [];
    for (const sub of subjects) {
      const res = await safePost("/subjects", {
        ...sub,
        teacher: teacherId
      }, sub.code);

      if (res) subjectIds.push(res.data._id);
    }

    /* ========== SESSIONS ========== */
    console.log("🕒 Creating session configs...");
    const sessions = [
      {
        name: "Period 1",
        startTime: "09:00",
        endTime: "10:00",
        duration: 60,
        type: "class"
      },
      {
        name: "Recess",
        startTime: "10:00",
        endTime: "10:15",
        duration: 15,
        type: "recess"
      },
      {
        name: "Period 2",
        startTime: "10:15",
        endTime: "11:15",
        duration: 60,
        type: "class"
      }
    ];

    for (const session of sessions) {
      await safePost("/sessions", session, session.name);
    }

    /* ========== TIMETABLE ========== */
    console.log("📅 Generating timetable...");
    if (classId && subjectIds.length) {
      await api.post("/timetables/generate", { classId });
    }

    console.log("\n✅ Seeding completed successfully!");
  } catch (err) {
    console.error("❌ Error seeding data");
    console.error("STATUS:", err.response?.status);
    console.error("DATA:", err.response?.data || err.message);
  }
}

seed();
