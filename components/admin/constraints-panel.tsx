"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface ConstraintsPanelProps {
  onConstraintsChange?: (constraints: any) => void
}

export function ConstraintsPanel({ onConstraintsChange }: ConstraintsPanelProps) {
  const handleChange = (field: string, value: any) => {
    const constraints = {
      daysPerWeek: 6,
      maxConsecutiveClasses: 2,
      minBreakBetweenClasses: 1,
      [field]: value,
    }
    onConstraintsChange?.(constraints)
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-lg mb-4">Scheduling Constraints</h3>

      <div className="space-y-4">
        <div>
          <Label htmlFor="daysPerWeek">Days per Week</Label>
          <Input
            id="daysPerWeek"
            type="number"
            min="4"
            max="6"
            defaultValue="6"
            onChange={(e) => handleChange("daysPerWeek", Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground mt-1">Total working days in a week</p>
        </div>

        <div>
          <Label htmlFor="maxConsecutive">Max Consecutive Classes</Label>
          <Input
            id="maxConsecutive"
            type="number"
            min="1"
            max="5"
            defaultValue="2"
            onChange={(e) => handleChange("maxConsecutiveClasses", Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground mt-1">Maximum classes for same subject in a row</p>
        </div>

        <div>
          <Label htmlFor="minBreak">Min Break Between Classes (periods)</Label>
          <Input
            id="minBreak"
            type="number"
            min="0"
            max="3"
            defaultValue="1"
            onChange={(e) => handleChange("minBreakBetweenClasses", Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground mt-1">Minimum periods between same subject classes</p>
        </div>
      </div>
    </Card>
  )
}
