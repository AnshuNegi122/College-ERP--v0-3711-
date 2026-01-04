import { Card } from "@/components/ui/card"
import type { ScheduleEntry } from "@/lib/types"

interface TimetableStatsProps {
  schedule: ScheduleEntry[]
  subjects: any[]
}

export function TimetableStats({ schedule, subjects }: TimetableStatsProps) {
  const classCount = schedule.filter((s) => s.type === "class").length
  const recessCount = schedule.filter((s) => s.type === "recess").length
  const lunchCount = schedule.filter((s) => s.type === "lunch").length
  const uniqueSubjects = new Set(schedule.filter((s) => s.subjectId).map((s) => s.subjectId?.toString()))

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="p-4">
        <p className="text-xs text-muted-foreground">Total Periods</p>
        <p className="text-2xl font-bold text-primary">{schedule.length}</p>
      </Card>
      <Card className="p-4">
        <p className="text-xs text-muted-foreground">Class Sessions</p>
        <p className="text-2xl font-bold text-primary">{classCount}</p>
      </Card>
      <Card className="p-4">
        <p className="text-xs text-muted-foreground">Recess Periods</p>
        <p className="text-2xl font-bold text-accent">{recessCount}</p>
      </Card>
      <Card className="p-4">
        <p className="text-xs text-muted-foreground">Lunch Breaks</p>
        <p className="text-2xl font-bold text-secondary">{lunchCount}</p>
      </Card>
    </div>
  )
}
