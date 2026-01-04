"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SessionFormProps {
  onSuccess?: () => void
}

export function SessionForm({ onSuccess }: SessionFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    startTime: "",
    endTime: "",
    duration: "",
    type: "class",
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
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({ name: "", startTime: "", endTime: "", duration: "", type: "class" })
        onSuccess?.()
      }
    } catch (error) {
      console.error("Failed to create session:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Add Session/Period</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Period Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g., Period 1"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="endTime">End Time</Label>
            <Input id="endTime" name="endTime" type="time" value={formData.endTime} onChange={handleChange} required />
          </div>
        </div>

        <div>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            name="duration"
            type="number"
            placeholder="e.g., 45"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <option value="class">Class</option>
            <option value="recess">Recess</option>
            <option value="lunch">Lunch</option>
          </select>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating..." : "Create Session"}
        </Button>
      </form>
    </Card>
  )
}
