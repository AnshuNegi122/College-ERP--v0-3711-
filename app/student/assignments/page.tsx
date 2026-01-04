"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      const classId = localStorage.getItem("classId")
      if (classId) {
        const res = await fetch(`/api/assignments?classId=${classId}`)
        const data = await res.json()
        setAssignments(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Failed to fetch assignments:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading assignments...</div>
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Assignments</h1>
        <p className="text-muted-foreground mb-6">View your course assignments and submissions</p>

        {assignments.length === 0 ? (
          <Card className="p-6">
            <p className="text-center text-muted-foreground">No assignments yet</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment: any) => (
              <Card key={assignment._id} className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{assignment.title}</h3>
                    <p className="text-sm text-muted-foreground">Subject: {assignment.subject}</p>
                  </div>
                  <Badge>{assignment.status}</Badge>
                </div>
                <p className="text-sm mb-3">{assignment.description}</p>
                <p className="text-xs text-muted-foreground">
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
