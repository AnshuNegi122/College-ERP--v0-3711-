"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AdminFeesPage() {
  const [fees, setFees] = useState<any[]>([])
  const [filter, setFilter] = useState<"all" | "pending" | "paid" | "overdue">("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFees()
  }, [filter])

  const fetchFees = async () => {
    try {
      const query = filter !== "all" ? `?status=${filter}` : ""
      const res = await fetch(`/api/fees${query}`)
      const data = await res.json()
      setFees(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch fees:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTotalRevenue = () => {
    return fees
      .filter((f: any) => f.status === "paid")
      .reduce((sum: number, f: any) => sum + (f.amount || 0), 0)
      .toFixed(2)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Fee Management</h1>
        <p className="text-muted-foreground mb-6">Manage student fees and payment tracking</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600">₹{calculateTotalRevenue()}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Pending Payments</p>
            <p className="text-3xl font-bold text-orange-600">
              {fees.filter((f: any) => f.status === "pending").length}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Overdue</p>
            <p className="text-3xl font-bold text-red-600">{fees.filter((f: any) => f.status === "overdue").length}</p>
          </Card>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded text-sm ${filter === "all" ? "bg-blue-500 text-white" : "bg-slate-200"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-3 py-1 rounded text-sm ${filter === "pending" ? "bg-blue-500 text-white" : "bg-slate-200"}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("paid")}
              className={`px-3 py-1 rounded text-sm ${filter === "paid" ? "bg-blue-500 text-white" : "bg-slate-200"}`}
            >
              Paid
            </button>
            <button
              onClick={() => setFilter("overdue")}
              className={`px-3 py-1 rounded text-sm ${filter === "overdue" ? "bg-blue-500 text-white" : "bg-slate-200"}`}
            >
              Overdue
            </button>
          </div>

          {fees.length === 0 ? (
            <p className="text-center text-muted-foreground">No fee records found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Student Name</th>
                    <th className="text-left p-2">Amount</th>
                    <th className="text-left p-2">Due Date</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Payment Method</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((fee: any) => (
                    <tr key={fee._id} className="border-b hover:bg-slate-50">
                      <td className="p-2">{fee.studentName}</td>
                      <td className="p-2">₹{fee.amount}</td>
                      <td className="p-2">{new Date(fee.dueDate).toLocaleDateString()}</td>
                      <td className="p-2">
                        <Badge
                          variant={
                            fee.status === "paid" ? "secondary" : fee.status === "overdue" ? "destructive" : "outline"
                          }
                        >
                          {fee.status}
                        </Badge>
                      </td>
                      <td className="p-2">{fee.paymentMethod || "Pending"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
