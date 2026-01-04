"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { TimetableView } from "@/components/timetable-view"
import { useRouter } from "next/navigation"

export default function StudentTimetablePage() {
  const router = useRouter()
  const [timetable, setTimetable] = useState<any>(null)
  const [sessions, setSessions] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const classId = localStorage.getItem("classId")
    if (!classId) {
      router.push("/student/dashboard")
      return
    }
    fetchData(classId)
  }, [router])

  const fetchData = async (classId: string) => {
    try {
      const [timetableRes, sessionsRes, subjectsRes] = await Promise.all([
        fetch(`/api/timetables?classId=${classId}&status=published`),
        fetch("/api/sessions"),
        fetch("/api/subjects"),
      ])

      const timetables = await timetableRes.json()
      const sessions = await sessionsRes.json()
      const subjects = await subjectsRes.json()

      setTimetable(Array.isArray(timetables) && timetables.length > 0 ? timetables[0] : null)
      setSessions(Array.isArray(sessions) ? sessions : [])
      setSubjects(Array.isArray(subjects) ? subjects : [])
    } catch (error) {
      console.error("Failed to fetch timetable:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading timetable...</div>
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">My Schedule</h1>
        <p className="text-muted-foreground mb-6">View your class timetable</p>

        {timetable ? (
          <Card className="p-6">
            <TimetableView schedule={timetable.schedule} sessions={sessions} subjects={subjects} />
          </Card>
        ) : (
          <Card className="p-6">
            <p className="text-center text-muted-foreground">No timetable published yet. Check back soon!</p>
          </Card>
        )}
      </div>
    </div>
  )
}
