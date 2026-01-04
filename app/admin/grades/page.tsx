"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

export default function AdminGradesPage() {
  const [classes, setClasses] = useState<any[]>([])
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [students, setStudents] = useState<any[]>([])
  const [grades, setGrades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/classes")
      const data = await res.json()
      setClasses(Array.isArray(data) ? data : [])
      if (Array.isArray(data) && data.length > 0) {
        setSelectedClass(data[0]._id)
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedClass) {
      fetchClassData()
    }
  }, [selectedClass])

  const fetchClassData = async () => {
    try {
      const [studentsRes, gradesRes] = await Promise.all([
        fetch(`/api/users?role=student&classId=${selectedClass}`),
        fetch(`/api/grades?classId=${selectedClass}`),
      ])

      const studentData = await studentsRes.json()
      const gradeData = await gradesRes.json()

      setStudents(Array.isArray(studentData) ? studentData : [])
      setGrades(Array.isArray(gradeData) ? gradeData : [])
    } catch (error) {
      console.error("Failed to fetch class data:", error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Academic Records</h1>
        <p className="text-muted-foreground mb-6">View and manage student grades</p>

        <Card className="p-6 mb-6">
          <label className="block mb-2 font-semibold">Select Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
          >
            {classes.map((cls: any) => (
              <option key={cls._id} value={cls._id}>
                {cls.name} - {cls.division}
              </option>
            ))}
          </select>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Class Grade Summary</h2>
          {students.length === 0 ? (
            <p className="text-center text-muted-foreground">No students in this class</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Student Name</th>
                    <th className="text-left p-2">Average Grade</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student: any) => {
                    const studentGrades = grades.filter((g: any) => g.studentId === student._id)
                    const avgGrade =
                      studentGrades.length > 0
                        ? (
                            studentGrades.reduce((sum: number, g: any) => sum + (g.percentage || 0), 0) /
                            studentGrades.length
                          ).toFixed(1)
                        : "N/A"

                    return (
                      <tr key={student._id} className="border-b hover:bg-slate-50">
                        <td className="p-2">{student.name}</td>
                        <td className="p-2">{avgGrade}</td>
                        <td className="p-2">
                          <span
                            className={
                              avgGrade !== "N/A" && Number(avgGrade) >= 60 ? "text-green-600" : "text-orange-600"
                            }
                          >
                            {avgGrade !== "N/A" && Number(avgGrade) >= 60 ? "Pass" : "Needs Improvement"}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
