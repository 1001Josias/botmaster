import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, GitBranch } from 'lucide-react'
import Link from 'next/link'

export function WorkflowHeader() {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Workflows</h2>
        <p className="text-muted-foreground">Manage and monitor your automation workflows</p>
      </div>
      <div className="flex items-center space-x-2">
        <Input placeholder="Search workflows..." className="h-9 w-[150px] lg:w-[250px]" />
        <Button asChild variant="outline" size="sm">
          <Link href="/workflow-editor">
            <GitBranch className="mr-2 h-4 w-4" />
            Visual Editor
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/workflows/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Workflow
          </Link>
        </Button>
      </div>
    </div>
  )
}
