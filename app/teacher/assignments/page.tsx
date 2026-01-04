"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TeacherAssignmentsPage() {
  const [myClasses, setMyClasses] = useState<any[]>([])
  const [assignments, setAssignments] = useState<any[]>([])
  const [selectedClassId, setSelectedClassId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
  })

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
      fetchAssignments()
    }
  }, [selectedClassId])

  const fetchAssignments = async () => {
    try {
      const res = await fetch(`/api/assignments?classId=${selectedClassId}`)
      const data = await res.json()
      setAssignments(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch assignments:", error)
    }
  }

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.dueDate) {
      alert("Please fill in all required fields")
      return
    }

    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          classId: selectedClassId,
          createdAt: new Date(),
        }),
      })

      if (res.ok) {
        alert("Assignment created successfully")
        setFormData({ title: "", description: "", dueDate: "" })
        setShowForm(false)
        fetchAssignments()
      }
    } catch (error) {
      console.error("Failed to create assignment:", error)
      alert("Failed to create assignment")
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Manage Assignments</h1>
        <p className="text-muted-foreground mb-6">Create and manage assignments for your classes</p>

        <Card className="p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <label className="block font-semibold">Select Class</label>
            <Button onClick={() => setShowForm(!showForm)} size="sm">
              {showForm ? "Cancel" : "Create Assignment"}
            </Button>
          </div>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
          >
            {myClasses.map((cls: any) => (
              <option key={cls._id} value={cls._id}>
                {cls.name} - {cls.division}
              </option>
            ))}
          </select>
        </Card>

        {showForm && (
          <Card className="p-6 mb-6">
            <form onSubmit={handleSubmitAssignment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Assignment title"
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Assignment details"
                  className="w-full px-3 py-2 border rounded"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Create Assignment
              </Button>
            </form>
          </Card>
        )}

        {assignments.length === 0 ? (
          <Card className="p-6">
            <p className="text-center text-muted-foreground">No assignments created yet</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment: any) => (
              <Card key={assignment._id} className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{assignment.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-sm">{assignment.description}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
