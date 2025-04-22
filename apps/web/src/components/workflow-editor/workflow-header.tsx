"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface WorkflowHeaderProps {
  workflowName: string
  setWorkflowName: (name: string) => void
}

export function WorkflowHeader({ workflowName, setWorkflowName }: WorkflowHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempName, setTempName] = useState(workflowName)

  const handleSaveName = () => {
    if (tempName.trim()) {
      setWorkflowName(tempName)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveName()
    } else if (e.key === "Escape") {
      setTempName(workflowName)
      setIsEditing(false)
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/workflows">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={handleKeyDown}
              className="w-64"
              autoFocus
            />
            <Button size="sm" onClick={handleSaveName}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        ) : (
          <div className="flex flex-col">
            <h1
              className="text-2xl font-bold tracking-tight cursor-pointer hover:text-primary"
              onClick={() => setIsEditing(true)}
            >
              {workflowName}
            </h1>
            <p className="text-sm text-muted-foreground">Click on the name to edit</p>
          </div>
        )}
      </div>
    </div>
  )
}

