"use client"
import type { ScheduleEntry } from "@/lib/types"

interface TimetablePreviewProps {
  schedule: ScheduleEntry[]
  sessions: any[]
  subjects: any[]
  classes: any[]
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export function TimetablePreview({ schedule, sessions, subjects, classes }: TimetablePreviewProps) {
  // Group schedule by day
  const scheduleByDay: Record<number, ScheduleEntry[]> = {}

  DAYS.forEach((_, index) => {
    scheduleByDay[index] = schedule.filter((e) => e.dayOfWeek === index)
  })

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-primary text-primary-foreground">
            <th className="border border-border px-3 py-2 text-left">Time</th>
            {DAYS.map((day) => (
              <th key={day} className="border border-border px-3 py-2 text-left">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sessions.map((session: any, sessionIndex: number) => (
            <tr key={sessionIndex} className="hover:bg-muted/50">
              <td className="border border-border px-3 py-2 font-semibold bg-muted text-xs">
                <div>{session.startTime}</div>
                <div>{session.endTime}</div>
              </td>
              {DAYS.map((_, dayIndex) => {
                const entry = scheduleByDay[dayIndex]?.find((e) => e.sessionNumber === sessionIndex)

                return (
                  <td key={`${dayIndex}-${sessionIndex}`} className="border border-border px-2 py-2">
                    {entry ? (
                      <div
                        className={`rounded p-1 text-xs ${
                          entry.type === "class"
                            ? "bg-primary/10 text-primary"
                            : entry.type === "recess"
                              ? "bg-yellow-100 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-400"
                              : "bg-blue-100 text-blue-900 dark:bg-blue-900/20 dark:text-blue-400"
                        }`}
                      >
                        {entry.type === "class" ? (
                          <>
                            <div className="font-semibold">
                              {subjects.find((s: any) => s._id === entry.subjectId)?.name || "N/A"}
                            </div>
                          </>
                        ) : (
                          <div className="font-semibold capitalize">{entry.type}</div>
                        )}
                      </div>
                    ) : null}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
