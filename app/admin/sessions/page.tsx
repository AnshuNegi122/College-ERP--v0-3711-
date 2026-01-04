"use client"

import { useEffect, useState } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { SessionForm } from "@/components/admin/session-form"
import { Card } from "@/components/ui/card"

export default function ManageSessions() {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch("/api/sessions")
      const data = await res.json()
      setSessions(data)
    } catch (error) {
      console.error("Failed to fetch sessions:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Session Configuration</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <SessionForm onSuccess={fetchData} />
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Configured Sessions</h2>
            <div className="space-y-3">
              {sessions.map((session) => (
                <Card key={session._id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{session.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {session.startTime} - {session.endTime}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Duration: {session.duration} min | Type: {session.type}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded">{session.type}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
