import { AdminSidebar } from "@/components/admin/sidebar"
import { Card } from "@/components/ui/card"

export default function HelpPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Help & Documentation</h1>

        <div className="max-w-3xl space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Getting Started</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">1. Configure Sessions</strong>
                <br />
                Start by setting up your school's daily schedule including break and lunch times.
              </p>
              <p>
                <strong className="text-foreground">2. Add Subjects</strong>
                <br />
                Create all subjects offered and assign them to teachers. Set the number of classes per week for each
                subject.
              </p>
              <p>
                <strong className="text-foreground">3. Create Classes</strong>
                <br />
                Define your class divisions (e.g., 10-A, 10-B) and assign class teachers.
              </p>
              <p>
                <strong className="text-foreground">4. Generate Timetables</strong>
                <br />
                Use the algorithm to automatically generate optimized schedules. Review and publish when ready.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Algorithm Features</h2>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Intelligent constraint satisfaction</li>
              <li>Balanced subject distribution across the week</li>
              <li>Minimum 2-period gap between same subject classes</li>
              <li>Maximum 2 consecutive classes for one subject</li>
              <li>Automatic recess and lunch period insertion</li>
              <li>Conflict detection and validation</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Common Questions</h2>
            <div className="space-y-4 text-sm">
              <div>
                <strong>Q: How are conflicts resolved?</strong>
                <p className="text-muted-foreground mt-1">
                  The algorithm ensures no teacher or class has conflicting assignments by checking assignments against
                  all constraints.
                </p>
              </div>
              <div>
                <strong>Q: Can I edit generated timetables?</strong>
                <p className="text-muted-foreground mt-1">
                  Currently, you can regenerate timetables. Manual editing features are coming soon.
                </p>
              </div>
              <div>
                <strong>Q: How do students access their timetable?</strong>
                <p className="text-muted-foreground mt-1">
                  Students log in with their credentials and can view their class schedule on their dashboard.
                </p>
              </div>
              <div>
                <strong>Q: Is the data secure?</strong>
                <p className="text-muted-foreground mt-1">
                  Yes, all data is encrypted and stored securely in MongoDB. Passwords are hashed and users have
                  role-based access.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Best Practices</h2>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Configure all sessions before creating subjects</li>
              <li>Ensure subjects and teachers are properly assigned</li>
              <li>Review the generated timetable before publishing</li>
              <li>Keep the system updated with all class divisions</li>
              <li>Regularly backup your database</li>
              <li>Use meaningful names for classes and subjects</li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  )
}
