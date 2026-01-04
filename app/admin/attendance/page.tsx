"use client"

import { useEffect, useState } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AttendanceReports() {
  const [classes, setClasses] = useState<any[]>([])
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState<any[]>([])

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      fetchReports()
      fetchStudents()
    }
  }, [selectedClass, selectedMonth, selectedYear])

  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/classes")
      const data = await res.json()
      setClasses(data)
      if (data.length > 0) {
        setSelectedClass(data[0]._id)
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error)
    }
  }

  const fetchStudents = async () => {
    try {
      const res = await fetch(`/api/users?classId=${selectedClass}&role=student`)
      const data = await res.json()
      setStudents(data)
    } catch (error) {
      console.error("Failed to fetch students:", error)
    }
  }

  const fetchReports = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/attendance/report?classId=${selectedClass}&month=${selectedMonth}&year=${selectedYear}`,
      )
      const data = await res.json()
      setReports(data)
    } catch (error) {
      console.error("Failed to fetch reports:", error)
    } finally {
      setLoading(false)
    }
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

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-100 text-green-800"
    if (percentage >= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const classData = classes.find((c) => c._id === selectedClass)

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Attendance Reports</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name} - {cls.division}
                </option>
              ))}
            </select>
          </div>

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

          <div className="flex items-end">
            <Button onClick={() => fetchReports()} className="w-full">
              Generate Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-slate-600 mb-2">Total Students</h3>
            <p className="text-2xl font-bold">{students.length}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-slate-600 mb-2">Average Attendance</h3>
            <p className="text-2xl font-bold">
              {reports.length > 0 ? Math.round(reports.reduce((sum, r) => sum + r.percentage, 0) / reports.length) : 0}%
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-slate-600 mb-2">
              {monthNames[selectedMonth]} {selectedYear}
            </h3>
            <p className="text-sm text-slate-600">
              {classData?.name} - {classData?.division}
            </p>
          </Card>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading reports...</div>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    <th className="p-4 text-left font-semibold">Student Name</th>
                    <th className="p-4 text-center font-semibold">Total Days</th>
                    <th className="p-4 text-center font-semibold">Present</th>
                    <th className="p-4 text-center font-semibold">Absent</th>
                    <th className="p-4 text-center font-semibold">Leave</th>
                    <th className="p-4 text-center font-semibold">Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const report = reports.find((r) => r.studentId === student._id)
                    const percentage = report?.percentage || 0
                    const totalDays = report?.totalDays || 0
                    const presentDays = report?.presentDays || 0
                    const absentDays = report?.absentDays || 0
                    const leaveDays = report?.leaveDays || 0

                    return (
                      <tr key={student._id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="p-4">{student.name}</td>
                        <td className="p-4 text-center text-sm">{totalDays}</td>
                        <td className="p-4 text-center text-sm text-green-700 font-medium">{presentDays}</td>
                        <td className="p-4 text-center text-sm text-red-700 font-medium">{absentDays}</td>
                        <td className="p-4 text-center text-sm text-yellow-700 font-medium">{leaveDays}</td>
                        <td className="p-4 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getAttendanceColor(percentage)}`}
                          >
                            {percentage}%
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {students.length === 0 && (
                <div className="text-center py-8 text-slate-500">No students found in this class</div>
              )}
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}
