"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { TimetableView } from "@/components/timetable-view"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function StudentDashboard() {
  const [timetable, setTimetable] = useState<any>(null)
  const [sessions, setSessions] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [studentClass, setStudentClass] = useState<string>("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Get student info from session/cookie (simplified for demo)
      const classId = localStorage.getItem("studentClassId")

      if (classId) {
        setStudentClass(classId)

        const [timetableRes, sessionsRes, subjectsRes, teachersRes] = await Promise.all([
          fetch(`/api/timetables?classId=${classId}`),
          fetch("/api/sessions"),
          fetch("/api/subjects"),
          fetch("/api/users?role=teacher"),
        ])

        const timetables = await timetableRes.json()
        const sessions = await sessionsRes.json()
        const subjects = await subjectsRes.json()
        const teachers = await teachersRes.json()

        // Get the latest published timetable
        const latestTimetable = timetables.find((t: any) => t.status === "published")

        setTimetable(latestTimetable)
        setSessions(sessions)
        setSubjects(subjects)
        setTeachers(teachers)
      }
    } catch (error) {
      console.error("Failed to fetch timetable:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading your timetable...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Timetable</h1>
          <Link href="/login">
            <Button variant="outline">Logout</Button>
          </Link>
        </div>

        {timetable ? (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Class Schedule</h2>
            <TimetableView schedule={timetable.schedule} sessions={sessions} subjects={subjects} teachers={teachers} />
          </Card>
        ) : (
          <Card className="p-6">
            <p className="text-center text-muted-foreground">No timetable published yet. Please check back later.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
