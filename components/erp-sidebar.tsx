"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function ERPSidebar({ userRole }: { userRole: string }) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.clear()
    router.push("/login")
  }

  const menuItems = {
    admin: [
      { href: "/admin/dashboard", label: "Dashboard" },
      { href: "/admin/students", label: "Student Management" },
      { href: "/admin/faculty", label: "Faculty Management" },
      { href: "/admin/classes", label: "Classes" },
      { href: "/admin/courses", label: "Courses" },
      { href: "/admin/subjects", label: "Subjects" },
      { href: "/admin/sessions", label: "Sessions" },
      { href: "/admin/generate", label: "Generate Timetable" },
      { href: "/admin/view-timetable", label: "View Timetable" },
      { href: "/admin/attendance", label: "Attendance Reports" },
      { href: "/admin/grades", label: "Academic Records" },
      { href: "/admin/fees", label: "Fee Management" },
      { href: "/admin/announcements", label: "Announcements" },
    ],
    student: [
      { href: "/student/dashboard", label: "Dashboard" },
      { href: "/student/timetable", label: "My Schedule" },
      { href: "/student/attendance", label: "Attendance" },
      { href: "/student/grades", label: "Grades" },
      { href: "/student/fees", label: "Fee Details" },
      { href: "/student/assignments", label: "Assignments" },
      { href: "/student/announcements", label: "Announcements" },
    ],
    teacher: [
      { href: "/teacher/dashboard", label: "Dashboard" },
      { href: "/teacher/timetable", label: "Schedule" },
      { href: "/teacher/attendance", label: "Mark Attendance" },
      { href: "/teacher/grades", label: "Enter Grades" },
      { href: "/teacher/assignments", label: "Assignments" },
      { href: "/teacher/announcements", label: "Announcements" },
    ],
  }

  const items = menuItems[userRole as keyof typeof menuItems] || []

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6 sticky top-0 overflow-y-auto">
      <h2 className="text-xl font-bold mb-8">CollegeERP</h2>
      <nav className="space-y-2">
        {items.map((item) => (
          <Link key={item.href} href={item.href}>
            <button className="w-full text-left px-4 py-2 rounded hover:bg-slate-800 transition text-sm">
              {item.label}
            </button>
          </Link>
        ))}
      </nav>
      <div className="mt-8 pt-8 border-t border-slate-700">
        <Button variant="destructive" onClick={handleLogout} className="w-full">
          Logout
        </Button>
      </div>
    </aside>
  )
}
