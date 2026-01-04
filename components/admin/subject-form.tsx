"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SubjectFormProps {
  teachers: any[]
  onSuccess?: () => void
}

export function SubjectForm({ teachers, onSuccess }: SubjectFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    teacher: "",
    hours: "",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({ name: "", code: "", teacher: "", hours: "" })
        onSuccess?.()
      }
    } catch (error) {
      console.error("Failed to create subject:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Add New Subject</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Subject Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g., Mathematics"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="code">Subject Code</Label>
          <Input
            id="code"
            name="code"
            placeholder="e.g., MATH101"
            value={formData.code}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="teacher">Teacher</Label>
          <select
            id="teacher"
            name="teacher"
            value={formData.teacher}
            onChange={handleChange}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            required
          >
            <option value="">Select a teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="hours">Weekly Hours</Label>
          <Input
            id="hours"
            name="hours"
            type="number"
            placeholder="e.g., 5"
            value={formData.hours}
            onChange={handleChange}
            required
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating..." : "Create Subject"}
        </Button>
      </form>
    </Card>
  )
}
