"use client"

import { useEffect, useState } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TimetableView } from "@/components/timetable-view"
import { TimetableStats } from "@/components/timetable-stats"

export default function ViewTimetables() {
  const [classes, setClasses] = useState<any[]>([])
  const [selectedClassId, setSelectedClassId] = useState<string>("")
  const [timetables, setTimetables] = useState<any[]>([])
  const [selectedTimetable, setSelectedTimetable] = useState<any>(null)
  const [sessions, setSessions] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      const [classesRes, sessionsRes, subjectsRes, teachersRes] = await Promise.all([
        fetch("/api/classes"),
        fetch("/api/sessions"),
        fetch("/api/subjects"),
        fetch("/api/users?role=teacher"),
      ])

      const classes = await classesRes.json()
      const sessions = await sessionsRes.json()
      const subjects = await subjectsRes.json()
      const teachers = await teachersRes.json()

      setClasses(classes)
      setSessions(sessions)
      setSubjects(subjects)
      setTeachers(teachers)

      if (classes.length > 0) {
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
      fetchTimetablesForClass(selectedClassId)
    }
  }, [selectedClassId])

  const fetchTimetablesForClass = async (classId: string) => {
    try {
      const res = await fetch(`/api/timetables?classId=${classId}`)
      const data = await res.json()
      setTimetables(data)
      if (data.length > 0) {
        setSelectedTimetable(data[0])
      }
    } catch (error) {
      console.error("Failed to fetch timetables:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <p>Loading timetables...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">View Timetables</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-4">
              <label className="block text-sm font-semibold mb-2">Select Class</label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name} - {cls.division}
                  </option>
                ))}
              </select>
            </Card>

            {timetables.length > 0 && (
              <Card className="p-4">
                <label className="block text-sm font-semibold mb-2">Select Timetable</label>
                <div className="space-y-2">
                  {timetables.map((tt) => (
                    <button
                      key={tt._id}
                      onClick={() => setSelectedTimetable(tt)}
                      className={`w-full text-left p-2 rounded text-sm ${
                        selectedTimetable?._id === tt._id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      <div>{new Date(tt.generatedAt).toLocaleDateString()}</div>
                      <div className="text-xs opacity-75">Status: {tt.status}</div>
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedTimetable ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4">
                    Timetable for {classes.find((c) => c._id === selectedClassId)?.name}
                  </h2>
                  <TimetableStats schedule={selectedTimetable.schedule} subjects={subjects} />
                </div>

                <Card className="p-6">
                  <TimetableView
                    schedule={selectedTimetable.schedule}
                    sessions={sessions}
                    subjects={subjects}
                    teachers={teachers}
                  />
                </Card>

                <div className="flex gap-4">
                  {selectedTimetable.status === "draft" && <Button>Publish Timetable</Button>}
                  <Button variant="outline">Download PDF</Button>
                  <Button variant="outline">Print</Button>
                </div>
              </div>
            ) : (
              <Card className="p-6">
                <p className="text-center text-muted-foreground">
                  No timetables found for this class. Generate one first.
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
