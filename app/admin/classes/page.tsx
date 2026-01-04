"use client"

import { useEffect, useState } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { ClassForm } from "@/components/admin/class-form"
import { Card } from "@/components/ui/card"

export default function ManageClasses() {
  const [classes, setClasses] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [classRes, userRes] = await Promise.all([fetch("/api/classes"), fetch("/api/users?role=teacher")])

      const classes = await classRes.json()
      const users = await userRes.json()

      setClasses(classes)
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
        <h1 className="text-3xl font-bold mb-8">Manage Classes</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ClassForm teachers={teachers} onSuccess={fetchData} />
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Existing Classes</h2>
            <div className="space-y-3">
              {classes.map((cls) => (
                <Card key={cls._id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{cls.name}</h3>
                      <p className="text-sm text-muted-foreground">{cls.division}</p>
                      <p className="text-xs text-muted-foreground">Strength: {cls.strength}</p>
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
