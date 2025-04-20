import { FlowDetails } from '@/components/flows/flow-details'
import { FlowJobs } from '@/components/flows/flow-jobs'
import { FlowDiagram } from '@/components/flows/flow-diagram'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function FlowDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/flows">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Flow {params.id}</h1>
          <p className="text-muted-foreground">Detalhes da execução do workflow</p>
        </div>
      </div>
      <FlowDetails id={params.id} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FlowDiagram id={params.id} />
        </div>
        <div>
          <FlowJobs id={params.id} />
        </div>
      </div>
    </div>
  )
}
