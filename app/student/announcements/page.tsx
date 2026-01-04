"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { ERPSidebar } from "@/components/erp-sidebar"

export default function StudentAnnouncements() {
  const router = useRouter()
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")

    if (userRole !== "student") {
      router.push("/login")
      return
    }

    fetchAnnouncements()
  }, [router])

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/announcements?audience=students")
      const data = await res.json()
      setAnnouncements(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch announcements:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: "border-red-300 bg-red-50",
      medium: "border-yellow-300 bg-yellow-50",
      low: "border-blue-300 bg-blue-50",
    }
    return colors[priority] || "border-slate-300 bg-slate-50"
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading announcements...</div>
  }

  return (
    <div className="flex min-h-screen">
      <ERPSidebar userRole="student" />

      <main className="flex-1 p-8 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Announcements</h1>
            <p className="text-muted-foreground">Stay updated with latest news and updates</p>
          </div>

          {announcements.length > 0 ? (
            <div className="space-y-4">
              {announcements.map((announcement, index) => (
                <Card key={index} className={`p-6 border-l-4 ${getPriorityColor(announcement.priority)}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{announcement.title}</h3>
                    <span className="text-xs px-2 py-1 rounded bg-slate-200 text-slate-700 capitalize">
                      {announcement.priority}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{announcement.content}</p>
                  <p className="text-xs text-slate-500">
                    Posted on {new Date(announcement.createdAt).toLocaleDateString()}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6">
              <p className="text-center text-muted-foreground">No announcements at this time.</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
