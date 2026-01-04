"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Timetable, ScheduleEntry, Subject, SessionConfig } from "@/lib/types"

interface TimetablePreviewModalProps {
  isOpen: boolean
  timetable: Timetable | null
  classInfo: any
  onClose: () => void
  onPublish: (timetableId: string) => Promise<void>
}

export function TimetablePreviewModal({
  isOpen,
  timetable,
  classInfo,
  onClose,
  onPublish,
}: TimetablePreviewModalProps) {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [sessions, setSessions] = useState<SessionConfig[]>([])
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchScheduleData()
    }
  }, [isOpen])

  const fetchScheduleData = async () => {
    try {
      const [subjectsRes, sessionsRes] = await Promise.all([fetch("/api/subjects"), fetch("/api/sessions")])
      const subjectsData = await subjectsRes.json()
      const sessionsData = await sessionsRes.json()
      setSubjects(subjectsData)
      setSessions(sessionsData)
    } catch (error) {
      console.error("Failed to fetch schedule data:", error)
    }
  }

  const getDayName = (dayIndex: number) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[dayIndex]
  }

  const getSessionTime = (sessionIndex: number) => {
    if (sessionIndex < sessions.length) {
      const session = sessions[sessionIndex]
      return `${session.startTime} - ${session.endTime}`
    }
    return "-"
  }

  const getSessionInfo = (entry: ScheduleEntry) => {
    if (entry.type === "recess") return { label: "RECESS", class: "bg-yellow-100" }
    if (entry.type === "lunch") return { label: "LUNCH", class: "bg-orange-100" }

    const subject = subjects.find((s) => s._id === entry.subjectId)
    return {
      label: subject?.name || "Unknown",
      class: "bg-blue-100",
    }
  }

  const handlePublish = async () => {
    if (!timetable) return
    setPublishing(true)
    try {
      await onPublish(timetable._id?.toString() || "")
      onClose()
    } finally {
      setPublishing(false)
    }
  }

  if (!isOpen || !timetable) return null

  // Group schedule by day
  const scheduleByDay: Record<number, ScheduleEntry[]> = {}
  timetable.schedule.forEach((entry) => {
    if (!scheduleByDay[entry.dayOfWeek]) {
      scheduleByDay[entry.dayOfWeek] = []
    }
    scheduleByDay[entry.dayOfWeek].push(entry)
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Timetable Preview</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {classInfo?.name} - {classInfo?.division}
              </p>
            </div>
            <button onClick={onClose} className="text-2xl font-bold text-muted-foreground hover:text-foreground">
              ×
            </button>
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 p-3 text-left font-semibold">Session</th>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <th key={i} className="border border-slate-300 p-3 text-center font-semibold">
                      <div className="text-sm">{getDayName(i)}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: sessions.length }).map((_, sessionIndex) => (
                  <tr key={sessionIndex}>
                    <td className="border border-slate-300 p-3 font-semibold text-sm whitespace-nowrap bg-slate-50">
                      <div>{getSessionTime(sessionIndex)}</div>
                    </td>
                    {Array.from({ length: 6 }).map((_, dayIndex) => {
                      const entry = scheduleByDay[dayIndex]?.find((e) => e.sessionNumber === sessionIndex)
                      const info = entry ? getSessionInfo(entry) : null

                      return (
                        <td
                          key={dayIndex}
                          className={`border border-slate-300 p-3 text-center text-sm font-medium ${
                            info?.class || "bg-white"
                          }`}
                        >
                          {info?.label || "-"}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handlePublish} disabled={publishing}>
              {publishing ? "Publishing..." : "Publish Timetable"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
