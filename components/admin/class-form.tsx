"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ClassFormProps {
  teachers: any[]
  onSuccess?: () => void
}

export function ClassForm({ teachers, onSuccess }: ClassFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    division: "",
    strength: "",
    classTeacher: "",
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
      const response = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({ name: "", division: "", strength: "", classTeacher: "" })
        onSuccess?.()
      }
    } catch (error) {
      console.error("Failed to create class:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Add New Class</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Class Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g., 10-A"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="division">Division</Label>
          <Input
            id="division"
            name="division"
            placeholder="e.g., Science"
            value={formData.division}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="strength">Strength</Label>
          <Input
            id="strength"
            name="strength"
            type="number"
            placeholder="e.g., 40"
            value={formData.strength}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="classTeacher">Class Teacher</Label>
          <select
            id="classTeacher"
            name="classTeacher"
            value={formData.classTeacher}
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

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating..." : "Create Class"}
        </Button>
      </form>
    </Card>
  )
}
