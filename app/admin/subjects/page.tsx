"use client"

import { useEffect, useState } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { SubjectForm } from "@/components/admin/subject-form"
import { Card } from "@/components/ui/card"

export default function ManageSubjects() {
  const [subjects, setSubjects] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [subRes, userRes] = await Promise.all([fetch("/api/subjects"), fetch("/api/users?role=teacher")])

      const subjects = await subRes.json()
      const users = await userRes.json()

      setSubjects(subjects)
      setTeachers(users.filter((u: any) => u.role === "teacher"))
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Manage Subjects</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <SubjectForm teachers={teachers} onSuccess={fetchData} />
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Existing Subjects</h2>
            <div className="space-y-3">
              {subjects.map((subject) => (
                <Card key={subject._id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{subject.name}</h3>
                      <p className="text-sm text-muted-foreground">Code: {subject.code}</p>
                      <p className="text-xs text-muted-foreground">Hours: {subject.hours}</p>
                    </div>
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
