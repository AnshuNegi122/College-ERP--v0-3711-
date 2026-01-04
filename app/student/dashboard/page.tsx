"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ERPSidebar } from "@/components/erp-sidebar"

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    attendance: 0,
    gpa: 0,
    pendingFees: 0,
    announcements: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    const userRole = localStorage.getItem("userRole")

    if (!userId || userRole !== "student") {
      router.push("/login")
      return
    }

    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    fetchDashboardData()
  }, [router])

  const fetchDashboardData = async () => {
    try {
      const userId = localStorage.getItem("userId")
      const classId = localStorage.getItem("classId")

      const [attendanceRes, gradesRes, feesRes, announcementsRes] = await Promise.all([
        fetch(
          `/api/attendance/report?studentId=${userId}&month=${new Date().getMonth()}&year=${new Date().getFullYear()}`,
        ),
        fetch(`/api/grades?studentId=${userId}`),
        fetch(`/api/fees?studentId=${userId}&status=pending`),
        fetch(`/api/announcements?audience=students`),
      ])

      const attendance = await attendanceRes.json()
      const grades = await gradesRes.json()
      const fees = await feesRes.json()
      const announcements = await announcementsRes.json()

      const attendancePercentage = Array.isArray(attendance) && attendance.length > 0 ? attendance[0].percentage : 0
      const gpa =
        Array.isArray(grades) && grades.length > 0
          ? (grades.reduce((sum: number, g: any) => sum + (g.percentage || 0), 0) / grades.length).toFixed(1)
          : 0
      const pendingFeesCount = Array.isArray(fees) ? fees.length : 0
      const announcementCount = Array.isArray(announcements) ? announcements.length : 0

      setStats({
        attendance: attendancePercentage,
        gpa: Number(gpa),
        pendingFees: pendingFeesCount,
        announcements: announcementCount,
      })
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading dashboard...</div>
  }

  return (
    <div className="flex min-h-screen">
      <ERPSidebar userRole="student" />

      <main className="flex-1 p-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
            <p className="text-muted-foreground">Student Dashboard</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Attendance</p>
              <p className="text-3xl font-bold text-primary">{stats.attendance}%</p>
            </Card>

            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">GPA</p>
              <p className="text-3xl font-bold text-primary">{stats.gpa}</p>
            </Card>

            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Pending Fees</p>
              <p className="text-3xl font-bold text-orange-600">{stats.pendingFees}</p>
            </Card>

            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Announcements</p>
              <p className="text-3xl font-bold text-blue-600">{stats.announcements}</p>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
              <div className="space-y-2">
                <Button className="w-full justify-start" variant="ghost">
                  View My Schedule
                </Button>
                <Button className="w-full justify-start" variant="ghost">
                  Check Attendance
                </Button>
                <Button className="w-full justify-start" variant="ghost">
                  View Grades
                </Button>
                <Button className="w-full justify-start" variant="ghost">
                  Pay Fees Online
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Important Notices</h2>
              <p className="text-sm text-muted-foreground mb-4">
                You have {stats.announcements} new announcements. Check the Announcements section for details.
              </p>
              {stats.pendingFees > 0 && (
                <p className="text-sm text-orange-600">You have {stats.pendingFees} pending fee payment(s).</p>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
