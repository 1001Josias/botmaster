'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { Worker, CreateWorkerDto, UpdateWorkerDto, createWorker, updateWorker } from '@/lib/api/workers'
import { useToast } from '@/hooks/use-toast'

interface WorkerFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  worker?: Worker | null
  onSave: () => void
}

export function WorkerFormDialog({ open, onOpenChange, worker, onSave }: WorkerFormDialogProps) {
  const { toast } = useToast()
  const isEditing = !!worker?.id
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<CreateWorkerDto & { tags: string[] }>({
    name: '',
    description: '',
    status: 'active',
    tags: [],
    scope: 'folder',
    scopeRef: null,
  })

  const [tagInput, setTagInput] = useState('')

  // Update form data when worker changes
  useEffect(() => {
    if (worker) {
      setFormData({
        name: worker.name,
        description: worker.description,
        status: worker.status,
        tags: worker.tags || [],
        scope: worker.scope,
        scopeRef: worker.scopeRef,
      })
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'active',
        tags: [],
        scope: 'folder',
        scopeRef: null,
      })
    }
    setTagInput('')
  }, [worker])

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Worker name is required',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      if (isEditing && worker) {
        const updateData: UpdateWorkerDto = {
          name: formData.name,
          description: formData.description,
          status: formData.status,
          tags: formData.tags,
        }
        await updateWorker(worker.id, updateData)
        toast({
          title: 'Success',
          description: 'Worker updated successfully',
        })
      } else {
        const createData: CreateWorkerDto = {
          name: formData.name,
          description: formData.description,
          status: formData.status,
          tags: formData.tags,
          scope: formData.scope,
          scopeRef: formData.scopeRef,
        }
        await createWorker(createData)
        toast({
          title: 'Success',
          description: 'Worker created successfully',
        })
      }
      
      onSave()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: isEditing ? 'Failed to update worker' : 'Failed to create worker',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Worker' : 'New Worker'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the worker information.'
              : 'Fill in the information to create a new worker.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Worker name"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Worker description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {!isEditing && (
                <div className="grid gap-2">
                  <Label htmlFor="scope">Scope</Label>
                  <Select value={formData.scope} onValueChange={(value) => handleChange('scope', value)}>
                    <SelectTrigger id="scope">
                      <SelectValue placeholder="Select scope" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="folder">Folder</SelectItem>
                      <SelectItem value="tenant">Tenant</SelectItem>
                      <SelectItem value="organization">Organization</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {!isEditing && formData.scope !== 'public' && (
              <div className="grid gap-2">
                <Label htmlFor="scopeRef">Scope Reference</Label>
                <Input
                  id="scopeRef"
                  value={formData.scopeRef || ''}
                  onChange={(e) => handleChange('scopeRef', e.target.value)}
                  placeholder="Scope reference key"
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a tag"
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline">
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Worker'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
