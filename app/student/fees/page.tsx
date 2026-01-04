"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ERPSidebar } from "@/components/erp-sidebar"

export default function StudentFees() {
  const router = useRouter()
  const [payments, setPayments] = useState<any[]>([])
  const [totalDue, setTotalDue] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    const userRole = localStorage.getItem("userRole")

    if (!userId || userRole !== "student") {
      router.push("/login")
      return
    }

    fetchFeeData()
  }, [router])

  const fetchFeeData = async () => {
    try {
      const userId = localStorage.getItem("userId")
      const res = await fetch(`/api/fees?studentId=${userId}`)
      const data = await res.json()

      const allPayments = Array.isArray(data) ? data : []
      setPayments(allPayments)

      const pendingTotal = allPayments
        .filter((p) => p.status === "pending" || p.status === "overdue")
        .reduce((sum, p) => sum + (p.amountPaid || 0), 0)

      setTotalDue(pendingTotal)
    } catch (error) {
      console.error("Failed to fetch fees:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      overdue: "bg-red-100 text-red-800",
    }
    return colors[status] || "bg-slate-100 text-slate-800"
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading fee details...</div>
  }

  return (
    <div className="flex min-h-screen">
      <ERPSidebar userRole="student" />

      <main className="flex-1 p-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Fee Details</h1>
            <p className="text-muted-foreground">View and manage your fee payments</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Due</p>
              <p className="text-3xl font-bold text-red-600">₹{totalDue}</p>
            </Card>

            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Paid Fees</p>
              <p className="text-3xl font-bold text-green-600">
                ₹{payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amountPaid, 0)}
              </p>
            </Card>

            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Records</p>
              <p className="text-3xl font-bold text-primary">{payments.length}</p>
            </Card>
          </div>

          {payments.length > 0 ? (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-100 border-b">
                      <th className="p-4 text-left font-semibold">Date</th>
                      <th className="p-4 text-left font-semibold">Amount</th>
                      <th className="p-4 text-left font-semibold">Method</th>
                      <th className="p-4 text-left font-semibold">Status</th>
                      <th className="p-4 text-left font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment, index) => (
                      <tr key={index} className="border-b hover:bg-slate-50">
                        <td className="p-4">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                        <td className="p-4">₹{payment.amountPaid}</td>
                        <td className="p-4 capitalize">{payment.paymentMethod}</td>
                        <td className={`p-4 ${getStatusBadge(payment.status)}`}>
                          <span className="px-2 py-1 rounded text-xs font-semibold">{payment.status}</span>
                        </td>
                        <td className="p-4">
                          {payment.status === "pending" && <Button size="sm">Pay Now</Button>}
                          {payment.status === "paid" && (
                            <Button size="sm" disabled>
                              Paid
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <p className="text-center text-muted-foreground">No fee records found.</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
