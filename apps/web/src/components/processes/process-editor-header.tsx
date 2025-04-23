'use client'

import React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Download, Save, Upload } from 'lucide-react'

interface ProcessEditorHeaderProps {
  processName: string
  setProcessName: (name: string) => void
  onSave: () => void
  onExport: () => void
  onImport: (file: File) => void
}

export function ProcessEditorHeader({
  processName,
  setProcessName,
  onSave,
  onExport,
  onImport,
}: ProcessEditorHeaderProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogProcessName, setDialogProcessName] = useState(processName)
  const [dialogProcessDescription, setDialogProcessDescription] = useState('')
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleSaveClick = () => {
    if (!processName) {
      setIsDialogOpen(true)
    } else {
      onSave()
    }
  }

  const handleSaveProcess = () => {
    setProcessName(dialogProcessName)
    setIsDialogOpen(false)
    onSave()
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImport(file)
    }
  }

  return (
    <div className="flex items-center justify-between border-b px-4 py-2">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.push('/processes')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold">{processName || 'New Process'}</h1>
      </div>
      <div className="flex items-center gap-2">
        <input type="file" ref={fileInputRef} className="hidden" accept=".json,.bpmn" onChange={handleFileChange} />
        <Button variant="outline" size="sm" onClick={handleImportClick}>
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button size="sm" onClick={handleSaveClick}>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Process</DialogTitle>
            <DialogDescription>Please provide a name and description for your process.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Process Name
              </label>
              <Input
                id="name"
                value={dialogProcessName}
                onChange={(e) => setDialogProcessName(e.target.value)}
                placeholder="Enter process name"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={dialogProcessDescription}
                onChange={(e) => setDialogProcessDescription(e.target.value)}
                placeholder="Enter process description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProcess} disabled={!dialogProcessName}>
              Save Process
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
