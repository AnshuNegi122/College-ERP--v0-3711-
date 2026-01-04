"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { TimetableView } from "@/components/timetable-view"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function StudentDashboard() {
  const [timetable, setTimetable] = useState<any>(null)
  const [sessions, setSessions] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [className, setClassName] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const classId = localStorage.getItem("studentClassId") || localStorage.getItem("userClassId")

      if (!classId) {
        setError("Student class information not found. Please contact administrator.")
        setLoading(false)
        return
      }

      const [timetableRes, sessionsRes, subjectsRes, teachersRes, classRes] = await Promise.all([
        fetch(`/api/timetables?classId=${classId}`),
        fetch("/api/sessions"),
        fetch("/api/subjects"),
        fetch("/api/users?role=teacher"),
        fetch(`/api/classes?id=${classId}`),
      ])

      if (!timetableRes.ok || !sessionsRes.ok) {
        throw new Error("Failed to fetch data")
      }

      const timetables = await timetableRes.json()
      const sessions = await sessionsRes.json()
      const subjects = await subjectsRes.json()
      const teachers = await teachersRes.json()
      const classes = await classRes.json()

      // Get the latest published timetable
      const latestTimetable = Array.isArray(timetables) ? timetables.find((t: any) => t.status === "published") : null

      if (classes && Array.isArray(classes) && classes.length > 0) {
        setClassName(`${classes[0].name} - ${classes[0].division}`)
      }

      setTimetable(latestTimetable)
      setSessions(sessions)
      setSubjects(subjects)
      setTeachers(teachers)
    } catch (error) {
      console.error("Failed to fetch timetable:", error)
      setError("Unable to load timetable. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("studentClassId")
    localStorage.removeItem("userClassId")
    router.push("/login")
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
          <div>
            <h1 className="text-3xl font-bold">My Timetable</h1>
            {className && <p className="text-muted-foreground mt-1">{className}</p>}
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {error && (
          <Card className="p-6 mb-6 bg-red-50 border-red-200">
            <p className="text-red-700">{error}</p>
          </Card>
        )}

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
