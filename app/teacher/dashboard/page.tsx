"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { TimetableView } from "@/components/timetable-view"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function TeacherDashboard() {
  const [myClasses, setMyClasses] = useState<any[]>([])
  const [timetables, setTimetables] = useState<any[]>([])
  const [sessions, setSessions] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClassId, setSelectedClassId] = useState<string>("")
  const router = useRouter()

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

      setMyClasses(classes)
      setSessions(sessions)
      setSubjects(subjects)

      if (classes.length > 0) {
        setSelectedClassId(classes[0]._id)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTimetables = async (classId: string) => {
    try {
      const res = await fetch(`/api/timetables?classId=${classId}`)
      const data = await res.json()
      setTimetables(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch timetables:", error)
      setTimetables([])
    }
  }

  useEffect(() => {
    if (selectedClassId) {
      fetchTimetables(selectedClassId)
    }
  }, [selectedClassId])

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  const selectedTimetable = timetables.find((t: any) => t.status === "published")

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Teaching Schedule</h1>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>

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

        {selectedTimetable ? (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Schedule for {myClasses.find((c) => c._id === selectedClassId)?.name}
            </h2>
            <TimetableView schedule={selectedTimetable.schedule} sessions={sessions} subjects={subjects} />
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
