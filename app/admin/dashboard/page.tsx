import { connectToDatabase } from "@/lib/db"
import { Card } from "@/components/ui/card"
import { AdminSidebar } from "@/components/admin/sidebar"

export default async function AdminDashboard() {
  const { db } = await connectToDatabase()

  const [classCount, subjectCount, userCount, timetableCount] = await Promise.all([
    db.collection("classes").countDocuments(),
    db.collection("subjects").countDocuments(),
    db.collection("users").countDocuments(),
    db.collection("timetables").countDocuments(),
  ])

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Classes</p>
            <p className="text-3xl font-bold text-primary">{classCount}</p>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Subjects</p>
            <p className="text-3xl font-bold text-primary">{subjectCount}</p>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Users</p>
            <p className="text-3xl font-bold text-primary">{userCount}</p>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Generated Timetables</p>
            <p className="text-3xl font-bold text-primary">{timetableCount}</p>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">System Overview</h2>
          <p className="text-muted-foreground mb-4">
            Welcome to the Timetable Management System. Use the sidebar to manage classes, subjects, and generate
            timetables.
          </p>
          <div className="space-y-2 text-sm">
            <p>✓ Configure school sessions and timings</p>
            <p>✓ Define subjects and assign teachers</p>
            <p>✓ Create class divisions</p>
            <p>✓ Generate optimized timetables</p>
            <p>✓ Manage user accounts and permissions</p>
          </div>
        </Card>
      </main>
    </div>
  )
}
