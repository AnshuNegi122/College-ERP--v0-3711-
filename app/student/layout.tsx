"use client"

import type React from "react"
import { ERPSidebar } from "@/components/erp-sidebar"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    if (!userRole || userRole !== "student") {
      router.push("/login")
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex min-h-screen">
      <ERPSidebar userRole="student" />
      <main className="flex-1 bg-slate-50">{children}</main>
    </div>
  )
}
