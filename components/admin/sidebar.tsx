import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AdminSidebar() {
  return (
    <aside className="w-64 border-r border-border bg-sidebar text-sidebar-foreground min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-sidebar-primary">TimeTable Pro</h1>
        <p className="text-sm text-sidebar-foreground/60">Admin Panel</p>
      </div>

      <nav className="space-y-3">
        <Link href="/admin/dashboard">
          <Button variant="ghost" className="w-full justify-start">
            Dashboard
          </Button>
        </Link>
        <Link href="/admin/classes">
          <Button variant="ghost" className="w-full justify-start">
            Manage Classes
          </Button>
        </Link>
        <Link href="/admin/subjects">
          <Button variant="ghost" className="w-full justify-start">
            Manage Subjects
          </Button>
        </Link>
        <Link href="/admin/sessions">
          <Button variant="ghost" className="w-full justify-start">
            Session Configuration
          </Button>
        </Link>
        <Link href="/admin/generate">
          <Button variant="ghost" className="w-full justify-start">
            Generate Timetables
          </Button>
        </Link>
        <Link href="/admin/users">
          <Button variant="ghost" className="w-full justify-start">
            Manage Users
          </Button>
        </Link>
      </nav>
    </aside>
  )
}
