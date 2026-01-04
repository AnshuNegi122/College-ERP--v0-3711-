"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { TimetableView } from "@/components/timetable-view"
import { useRouter } from "next/navigation"

export default function TeacherTimetablePage() {
  const router = useRouter()
  const [myClasses, setMyClasses] = useState<any[]>([])
  const [selectedClassId, setSelectedClassId] = useState<string>("")
  const [timetable, setTimetable] = useState<any>(null)
  const [sessions, setSessions] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [classesRes, sessionsRes, subjectsRes] = await Promise.all([
        fetch("/api/classes"),
        fetch("/api/sessions"),
        fetch("/api/subjects"),
      ])

      const classes = await classesRes.json()
      const sessions = await sessionsRes.json()
      const subjects = await subjectsRes.json()

      setMyClasses(Array.isArray(classes) ? classes : [])
      setSessions(Array.isArray(sessions) ? sessions : [])
      setSubjects(Array.isArray(subjects) ? subjects : [])

      if (Array.isArray(classes) && classes.length > 0) {
        setSelectedClassId(classes[0]._id)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedClassId) {
      fetchTimetable(selectedClassId)
    }
  }, [selectedClassId])

  const fetchTimetable = async (classId: string) => {
    try {
      const res = await fetch(`/api/timetables?classId=${classId}&status=published`)
      const data = await res.json()
      setTimetable(Array.isArray(data) && data.length > 0 ? data[0] : null)
    } catch (error) {
      console.error("Failed to fetch timetable:", error)
      setTimetable(null)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading schedule...</div>
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">My Schedule</h1>
        <p className="text-muted-foreground mb-6">View and manage your teaching schedule</p>

        <Card className="p-6 mb-6">
          <label className="block mb-2 font-semibold">Select Class</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {myClasses.map((cls: any) => (
              <option key={cls._id} value={cls._id}>
                {cls.name} - {cls.division}
              </option>
            ))}
          </select>
        </Card>

        {timetable ? (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Schedule for {myClasses.find((c) => c._id === selectedClassId)?.name}
            </h2>
            <TimetableView schedule={timetable.schedule} sessions={sessions} subjects={subjects} />
          </Card>
        ) : (
          <Card className="p-6">
            <p className="text-center text-muted-foreground">No timetable published for this class yet.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
