"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ManageUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "teacher",
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users")
      const data = await res.json()
      setUsers(data)
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setFormData({ name: "", email: "", password: "", role: "teacher" })
        setShowForm(false)
        fetchUsers()
      }
    } catch (error) {
      console.error("Failed to create user:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <p>Loading users...</p>
        </main>
      </div>
    )
  }

  const adminCount = users.filter((u) => u.role === "admin").length
  const teacherCount = users.filter((u) => u.role === "teacher").length
  const studentCount = users.filter((u) => u.role === "student").length

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Users</h1>
          <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "Add New User"}</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Administrators</p>
            <p className="text-3xl font-bold text-primary">{adminCount}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Teachers</p>
            <p className="text-3xl font-bold text-primary">{teacherCount}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Students</p>
            <p className="text-3xl font-bold text-primary">{studentCount}</p>
          </Card>
        </div>

        {/* Add User Form */}
        {showForm && (
          <Card className="p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Create New User</h2>
            <form onSubmit={handleCreateUser} className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <option value="admin">Admin</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                </select>
              </div>

              <Button type="submit" className="col-span-2">
                Create User
              </Button>
            </form>
          </Card>
        )}

        {/* Users List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">All Users</h2>
          <div className="grid gap-4">
            {users.map((user) => (
              <Card key={user._id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-xs font-semibold capitalize ${
                      user.role === "admin"
                        ? "bg-destructive/20 text-destructive"
                        : user.role === "teacher"
                          ? "bg-primary/20 text-primary"
                          : "bg-secondary/20 text-secondary"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
