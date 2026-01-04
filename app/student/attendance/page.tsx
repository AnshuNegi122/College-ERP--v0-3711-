"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function StudentAttendance() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([])

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    const userRole = localStorage.getItem("userRole")

    if (!userId || userRole !== "student") {
      router.push("/login")
      return
    }

    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    fetchAttendance()
  }, [router, selectedMonth, selectedYear])

  const fetchAttendance = async () => {
    const userId = localStorage.getItem("userId")
    const classId = localStorage.getItem("classId")
    setLoading(true)

    try {
      const [reportRes, recordsRes] = await Promise.all([
        fetch(
          `/api/attendance/report?studentId=${userId}&month=${selectedMonth}&year=${selectedYear}&classId=${classId}`,
        ),
        fetch(`/api/attendance?studentId=${userId}&classId=${classId}`),
      ])

      const reportData = await reportRes.json()
      const recordsData = await recordsRes.json()

      if (Array.isArray(reportData) && reportData.length > 0) {
        setReport(reportData[0])
      }

      if (Array.isArray(recordsData)) {
        setAttendanceRecords(recordsData)
      }
    } catch (error) {
      console.error("Failed to fetch attendance:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push("/login")
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">Present</span>
      case "absent":
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">Absent</span>
      case "leave":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold">Leave</span>
      default:
        return <span className="px-2 py-1 bg-slate-100 text-slate-800 rounded text-xs font-semibold">-</span>
    }
  }

  const getReportColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-100"
    if (percentage >= 60) return "bg-yellow-100"
    return "bg-red-100"
  }

  if (loading) {
    return <div className="text-center py-8">Loading attendance...</div>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Attendance</h1>
            <p className="text-sm text-slate-600">Welcome, {user?.name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number.parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-md"
            >
              {monthNames.map((month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number.parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-md"
            >
              {Array.from({ length: 5 }).map((_, i) => {
                const year = new Date().getFullYear() - 2 + i
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              })}
            </select>
          </div>
        </div>

        {report && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className={`p-6 ${getReportColor(report.percentage)}`}>
              <h3 className="text-sm font-semibold text-slate-600 mb-2">Attendance %</h3>
              <p className="text-3xl font-bold">{report.percentage}%</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-semibold text-slate-600 mb-2">Total Days</h3>
              <p className="text-3xl font-bold">{report.totalDays}</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-semibold text-slate-600 mb-2">Present</h3>
              <p className="text-3xl font-bold text-green-700">{report.presentDays}</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-semibold text-slate-600 mb-2">Absent</h3>
              <p className="text-3xl font-bold text-red-700">{report.absentDays}</p>
            </Card>
          </div>
        )}

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200">
                  <th className="p-4 text-left font-semibold">Date</th>
                  <th className="p-4 text-left font-semibold">Session</th>
                  <th className="p-4 text-left font-semibold">Status</th>
                  <th className="p-4 text-left font-semibold">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.length > 0 ? (
                  attendanceRecords
                    .filter((record) => {
                      const recordDate = new Date(record.date)
                      return recordDate.getMonth() === selectedMonth && recordDate.getFullYear() === selectedYear
                    })
                    .map((record, index) => (
                      <tr key={index} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="p-4 text-sm">{new Date(record.date).toLocaleDateString()}</td>
                        <td className="p-4 text-sm">Session {record.sessionNumber + 1}</td>
                        <td className="p-4">{getStatusBadge(record.status)}</td>
                        <td className="p-4 text-sm text-slate-600">{record.remarks || "-"}</td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-slate-500">
                      No attendance records found for this period
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  )
}
