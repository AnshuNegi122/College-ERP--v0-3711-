"use client"

import { useEffect, useState } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TimetablePreviewModal } from "@/components/timetable-preview-modal"

export default function GenerateTimetables() {
  const [classes, setClasses] = useState<any[]>([])
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [timetables, setTimetables] = useState<any[]>([])
  const [previewTimetable, setPreviewTimetable] = useState<any | null>(null)
  const [previewClass, setPreviewClass] = useState<any | null>(null)

  useEffect(() => {
    fetchClasses()
    fetchTimetables()
  }, [])

  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/classes")
      const data = await res.json()
      setClasses(data)
    } catch (error) {
      console.error("Failed to fetch classes:", error)
    }
  }

  const fetchTimetables = async () => {
    try {
      const res = await fetch("/api/timetables")
      const data = await res.json()
      setTimetables(data)
    } catch (error) {
      console.error("Failed to fetch timetables:", error)
    }
  }

  const handleGenerate = async () => {
    if (!selectedClass) {
      setMessage("Please select a class")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const res = await fetch("/api/timetables/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: selectedClass,
          daysPerWeek: 6,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage("Timetable generated successfully!")
        fetchTimetables()
        const classData = classes.find((c) => c._id === selectedClass)
        setPreviewClass(classData)
        const generatedTimetable = {
          _id: data.timetableId,
          classId: selectedClass,
          schedule: data.schedule,
          generatedAt: new Date(),
          status: "draft",
        }
        setPreviewTimetable(generatedTimetable)
        setSelectedClass("")
      } else {
        setMessage(data.error || "Failed to generate timetable")
      }
    } catch (error) {
      setMessage("Error generating timetable")
      console.error("Failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async (timetableId: string) => {
    try {
      const res = await fetch("/api/timetables", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timetableId,
          status: "published",
        }),
      })

      if (res.ok) {
        setMessage("Timetable published successfully!")
        fetchTimetables()
        setPreviewTimetable(null)
        setPreviewClass(null)
      }
    } catch (error) {
      console.error("Failed:", error)
    }
  }

  const handleViewTimetable = (timetable: any) => {
    const classData = classes.find((c) => c._id === timetable.classId)
    setPreviewClass(classData)
    setPreviewTimetable(timetable)
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Generate Timetables</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Generate New Timetable</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Class</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    <option value="">Choose a class</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name} - {cls.division}
                      </option>
                    ))}
                  </select>
                </div>

                <Button onClick={handleGenerate} disabled={loading || !selectedClass} className="w-full">
                  {loading ? "Generating..." : "Generate Timetable"}
                </Button>

                {message && (
                  <p
                    className={`text-sm ${
                      message.includes("success") || message.includes("successfully")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {message}
                  </p>
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Generated Timetables</h2>
            <div className="space-y-3">
              {timetables.map((timetable) => {
                const cls = classes.find((c) => c._id === timetable.classId)
                return (
                  <Card key={timetable._id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">
                          {cls?.name} - {cls?.division}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Generated: {new Date(timetable.generatedAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Status: <span className="capitalize font-semibold">{timetable.status}</span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleViewTimetable(timetable)}>
                          View
                        </Button>
                        {timetable.status === "draft" && (
                          <Button size="sm" onClick={() => handlePublish(timetable._id)}>
                            Publish
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>

        <TimetablePreviewModal
          isOpen={previewTimetable !== null}
          timetable={previewTimetable}
          classInfo={previewClass}
          onClose={() => {
            setPreviewTimetable(null)
            setPreviewClass(null)
          }}
          onPublish={handlePublish}
        />
      </main>
    </div>
  )
}
