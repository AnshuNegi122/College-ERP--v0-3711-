"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface AttendanceMarkerProps {
  classId: string
  onSubmit?: () => void
}

interface StudentAttendance {
  studentId: string
  name: string
  status: "present" | "absent" | "leave"
  remarks: string
}

export function AttendanceMarker({ classId, onSubmit }: AttendanceMarkerProps) {
  const [students, setStudents] = useState<StudentAttendance[]>([])
  const [attendance, setAttendance] = useState<StudentAttendance[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedSession, setSelectedSession] = useState(0)

  useEffect(() => {
    fetchStudents()
  }, [classId])

  const fetchStudents = async () => {
    try {
      const res = await fetch(`/api/users?classId=${classId}&role=student`)
      const data = await res.json()

      const studentList = data.map((user: any) => ({
        studentId: user._id,
        name: user.name,
        status: "present" as const,
        remarks: "",
      }))

      setStudents(studentList)
      setAttendance(studentList)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch students:", error)
      setMessage("Failed to load students")
      setLoading(false)
    }
  }

  const handleStatusChange = (studentId: string, status: "present" | "absent" | "leave") => {
    setAttendance((prev) => prev.map((a) => (a.studentId === studentId ? { ...a, status } : a)))
  }

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendance((prev) => prev.map((a) => (a.studentId === studentId ? { ...a, remarks } : a)))
  }

  const handleSubmit = async () => {
    if (!selectedDate) {
      setMessage("Please select a date")
      return
    }

    setSubmitting(true)
    setMessage("")

    try {
      const userId = localStorage.getItem("userId")
      const date = new Date(selectedDate)
      const dayOfWeek = date.getDay()

      const res = await fetch("/api/attendance/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId,
          date: selectedDate,
          sessionNumber: selectedSession,
          dayOfWeek,
          attendance: attendance.map((a) => ({
            studentId: a.studentId,
            status: a.status,
            remarks: a.remarks,
          })),
          markedBy: userId,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage("Attendance marked successfully!")
        setTimeout(() => {
          onSubmit?.()
        }, 1500)
      } else {
        setMessage(data.error || "Failed to mark attendance")
      }
    } catch (error) {
      setMessage("Error marking attendance")
      console.error("Failed:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const markAll = (status: "present" | "absent" | "leave") => {
    setAttendance((prev) =>
      prev.map((a) => ({
        ...a,
        status,
      })),
    )
  }

  if (loading) {
    return <div className="text-center py-8">Loading students...</div>
  }

  const presentCount = attendance.filter((a) => a.status === "present").length
  const absentCount = attendance.filter((a) => a.status === "absent").length
  const leaveCount = attendance.filter((a) => a.status === "leave").length

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Mark Attendance</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Session</label>
            <input
              type="number"
              value={selectedSession}
              onChange={(e) => setSelectedSession(Number.parseInt(e.target.value))}
              min="0"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="flex items-end gap-2">
            <Button variant="outline" size="sm" onClick={() => markAll("present")}>
              Mark All Present
            </Button>
          </div>
        </div>

        <div className="flex gap-4 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-200 rounded"></div>
            <span>Present: {presentCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 rounded"></div>
            <span>Absent: {absentCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-200 rounded"></div>
            <span>Leave: {leaveCount}</span>
          </div>
        </div>
      </Card>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-300 p-3 text-left font-semibold">Student Name</th>
              <th className="border border-slate-300 p-3 text-center font-semibold">Status</th>
              <th className="border border-slate-300 p-3 text-left font-semibold">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((student) => (
              <tr
                key={student.studentId}
                className={
                  student.status === "present"
                    ? "bg-green-50"
                    : student.status === "absent"
                      ? "bg-red-50"
                      : "bg-yellow-50"
                }
              >
                <td className="border border-slate-300 p-3">{student.name}</td>
                <td className="border border-slate-300 p-3 text-center">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleStatusChange(student.studentId, "present")}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        student.status === "present" ? "bg-green-500 text-white" : "bg-green-200 text-green-800"
                      }`}
                    >
                      P
                    </button>
                    <button
                      onClick={() => handleStatusChange(student.studentId, "absent")}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        student.status === "absent" ? "bg-red-500 text-white" : "bg-red-200 text-red-800"
                      }`}
                    >
                      A
                    </button>
                    <button
                      onClick={() => handleStatusChange(student.studentId, "leave")}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        student.status === "leave" ? "bg-yellow-500 text-white" : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      L
                    </button>
                  </div>
                </td>
                <td className="border border-slate-300 p-3">
                  <input
                    type="text"
                    placeholder="Add remarks..."
                    value={student.remarks}
                    onChange={(e) => handleRemarksChange(student.studentId, e.target.value)}
                    className="w-full px-2 py-1 text-sm border rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 justify-end">
        {message && (
          <p className={`flex-1 text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Attendance"}
        </Button>
      </div>
    </div>
  )
}
