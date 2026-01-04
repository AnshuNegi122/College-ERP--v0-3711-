"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { ERPSidebar } from "@/components/erp-sidebar"

export default function StudentGrades() {
  const router = useRouter()
  const [grades, setGrades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSemester, setSelectedSemester] = useState(1)

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    const userRole = localStorage.getItem("userRole")

    if (!userId || userRole !== "student") {
      router.push("/login")
      return
    }

    fetchGrades()
  }, [router, selectedSemester])

  const fetchGrades = async () => {
    try {
      const userId = localStorage.getItem("userId")
      const res = await fetch(`/api/grades?studentId=${userId}&semester=${selectedSemester}`)
      const data = await res.json()
      setGrades(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch grades:", error)
    } finally {
      setLoading(false)
    }
  }

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      "A+": "text-green-700",
      A: "text-green-600",
      "B+": "text-blue-600",
      B: "text-blue-500",
      C: "text-yellow-600",
      D: "text-orange-600",
      F: "text-red-700",
    }
    return colors[grade] || "text-slate-700"
  }

  const calculateCGPA = () => {
    if (grades.length === 0) return 0
    const totalPercentage = grades.reduce((sum, g) => sum + (g.percentage || 0), 0)
    return (totalPercentage / grades.length).toFixed(2)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading grades...</div>
  }

  return (
    <div className="flex min-h-screen">
      <ERPSidebar userRole="student" />

      <main className="flex-1 p-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">My Grades</h1>
            <p className="text-muted-foreground">View your academic performance</p>
          </div>

          <div className="mb-6 flex gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Semester</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(Number(e.target.value))}
                className="px-4 py-2 border rounded-md"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Card className="p-6 mb-6">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Current GPA</p>
                <p className="text-2xl font-bold text-primary">{calculateCGPA()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Courses</p>
                <p className="text-2xl font-bold text-primary">{grades.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Percentage</p>
                <p className="text-2xl font-bold text-primary">{calculateCGPA()}%</p>
              </div>
            </div>
          </Card>

          {grades.length > 0 ? (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-100 border-b">
                      <th className="p-4 text-left font-semibold">Course</th>
                      <th className="p-4 text-left font-semibold">Marks Obtained</th>
                      <th className="p-4 text-left font-semibold">Total Marks</th>
                      <th className="p-4 text-left font-semibold">Percentage</th>
                      <th className="p-4 text-left font-semibold">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((grade, index) => (
                      <tr key={index} className="border-b hover:bg-slate-50">
                        <td className="p-4">Course {grade.courseId}</td>
                        <td className="p-4">{grade.marksObtained}</td>
                        <td className="p-4">{grade.totalMarks}</td>
                        <td className="p-4">{grade.percentage}%</td>
                        <td className={`p-4 font-bold ${getGradeColor(grade.grade)}`}>{grade.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <p className="text-center text-muted-foreground">No grades published yet for this semester.</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
