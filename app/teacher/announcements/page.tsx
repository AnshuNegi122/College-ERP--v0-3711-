"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function TeacherAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "normal",
  })

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/announcements?audience=all")
      const data = await res.json()
      setAnnouncements(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch announcements:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.content) {
      alert("Please fill in all fields")
      return
    }

    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          createdBy: localStorage.getItem("userEmail"),
          createdAt: new Date(),
          audience: "students",
        }),
      })

      if (res.ok) {
        alert("Announcement posted successfully")
        setFormData({ title: "", content: "", priority: "normal" })
        setShowForm(false)
        fetchAnnouncements()
      }
    } catch (error) {
      console.error("Failed to create announcement:", error)
      alert("Failed to post announcement")
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Announcements</h1>
        <p className="text-muted-foreground mb-6">Post announcements and updates for students</p>

        <div className="flex justify-end mb-6">
          <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "New Announcement"}</Button>
        </div>

        {showForm && (
          <Card className="p-6 mb-6">
            <form onSubmit={handleSubmitAnnouncement} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Announcement title"
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Announcement content"
                  className="w-full px-3 py-2 border rounded"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>
              <Button type="submit" className="w-full">
                Post Announcement
              </Button>
            </form>
          </Card>
        )}

        {announcements.length === 0 ? (
          <Card className="p-6">
            <p className="text-center text-muted-foreground">No announcements yet</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement: any) => (
              <Card key={announcement._id} className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{announcement.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      Posted by {announcement.createdBy} on {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={announcement.priority === "high" ? "destructive" : "secondary"}>
                    {announcement.priority}
                  </Badge>
                </div>
                <p className="text-sm">{announcement.content}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
