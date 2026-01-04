"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TeacherGradesPage() {
  const [myClasses, setMyClasses] = useState<any[]>([])
  const [selectedClassId, setSelectedClassId] = useState<string>("")
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [grades, setGrades] = useState<Record<string, string>>({})
  const [remarks, setRemarks] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/classes")
      const data = await res.json()
      setMyClasses(Array.isArray(data) ? data : [])
      if (Array.isArray(data) && data.length > 0) {
        setSelectedClassId(data[0]._id)
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedClassId) {
      fetchStudents()
    }
  }, [selectedClassId])

  const fetchStudents = async () => {
    try {
      const res = await fetch(`/api/users?role=student&classId=${selectedClassId}`)
      const data = await res.json()
      setStudents(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch students:", error)
    }
  }

  const handleGradeSubmit = async (studentId: string, subjectId: string) => {
    const gradeValue = grades[`${studentId}-${subjectId}`]
    const remarkValue = remarks[`${studentId}-${subjectId}`]

    if (!gradeValue) return

    try {
      const res = await fetch("/api/grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          subjectId,
          grade: gradeValue,
          remark: remarkValue || "",
          classId: selectedClassId,
        }),
      })

      if (res.ok) {
        alert("Grade submitted successfully")
        setGrades({ ...grades, [`${studentId}-${subjectId}`]: "" })
        setRemarks({ ...remarks, [`${studentId}-${subjectId}`]: "" })
      }
    } catch (error) {
      console.error("Failed to submit grade:", error)
      alert("Failed to submit grade")
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Enter Grades</h1>
        <p className="text-muted-foreground mb-6">Assign grades to your students</p>

        <Card className="p-6 mb-6">
          <label className="block mb-2 font-semibold">Select Class</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
          >
            {myClasses.map((cls: any) => (
              <option key={cls._id} value={cls._id}>
                {cls.name} - {cls.division}
              </option>
            ))}
          </select>
        </Card>

        {students.length === 0 ? (
          <Card className="p-6">
            <p className="text-center text-muted-foreground">No students in this class yet</p>
          </Card>
        ) : (
          <Card className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Student Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Grade</th>
                    <th className="text-left p-2">Remarks</th>
                    <th className="text-left p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student: any) => (
                    <tr key={student._id} className="border-b hover:bg-slate-50">
                      <td className="p-2">{student.name}</td>
                      <td className="p-2">{student.email}</td>
                      <td className="p-2">
                        <select
                          value={grades[`${student._id}-subject`] || ""}
                          onChange={(e) => setGrades({ ...grades, [`${student._id}-subject`]: e.target.value })}
                          className="w-20 px-2 py-1 border rounded"
                        >
                          <option value="">Select</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                          <option value="F">F</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={remarks[`${student._id}-subject`] || ""}
                          onChange={(e) => setRemarks({ ...remarks, [`${student._id}-subject`]: e.target.value })}
                          placeholder="Add remarks"
                          className="w-32 px-2 py-1 border rounded text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <Button
                          size="sm"
                          onClick={() => handleGradeSubmit(student._id, "subject")}
                          disabled={!grades[`${student._id}-subject`]}
                        >
                          Submit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
