"use client"

interface TimetableEntry {
  dayOfWeek: number
  sessionNumber: number
  subjectId?: string
  subjectName?: string
  teacherId?: string
  teacherName?: string
  roomNumber?: string
  type: string
  startTime?: string
  endTime?: string
}

interface TimetableViewProps {
  schedule: TimetableEntry[]
  sessions: any[]
  subjects?: any[]
  teachers?: any[]
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export function TimetableView({ schedule, sessions, subjects = [], teachers = [] }: TimetableViewProps) {
  // Enrich schedule with subject and teacher names
  const enrichedSchedule = schedule.map((entry) => {
    const subject = subjects.find((s) => s._id === entry.subjectId)
    const teacher = teachers.find((t) => t._id === entry.teacherId)
    const session = sessions[entry.sessionNumber]

    return {
      ...entry,
      subjectName: subject?.name || "N/A",
      teacherName: teacher?.name || "N/A",
      startTime: session?.startTime || "",
      endTime: session?.endTime || "",
    }
  })

  // Group by day
  const scheduleByDay: Record<number, TimetableEntry[]> = {}
  DAYS.forEach((_, index) => {
    scheduleByDay[index] = enrichedSchedule.filter((e) => e.dayOfWeek === index)
  })

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-primary text-primary-foreground">
            <th className="border border-border px-4 py-2 text-left">Time</th>
            {DAYS.map((day) => (
              <th key={day} className="border border-border px-4 py-2 text-left">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sessions.map((session: any, sessionIndex: number) => (
            <tr key={sessionIndex} className="hover:bg-muted">
              <td className="border border-border px-4 py-2 font-semibold bg-muted">
                <div className="text-xs">{session.startTime}</div>
                <div className="text-xs">{session.endTime}</div>
              </td>
              {DAYS.map((_, dayIndex) => {
                const entry = scheduleByDay[dayIndex]?.find((e) => e.sessionNumber === sessionIndex)

                return (
                  <td key={`${dayIndex}-${sessionIndex}`} className="border border-border px-4 py-2">
                    {entry ? (
                      <div
                        className={`rounded p-2 text-sm ${
                          entry.type === "recess" || entry.type === "lunch"
                            ? "bg-accent text-accent-foreground text-center font-semibold"
                            : "bg-card"
                        }`}
                      >
                        {entry.type === "class" ? (
                          <>
                            <div className="font-semibold">{entry.subjectName}</div>
                            <div className="text-xs text-muted-foreground">{entry.teacherName}</div>
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
