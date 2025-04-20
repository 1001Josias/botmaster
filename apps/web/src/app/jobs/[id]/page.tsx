import { JobDetails } from '@/components/jobs/job-details'
import { JobLogs } from '@/components/jobs/job-logs'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function JobDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6 pb-[350px]">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/jobs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Job {params.id}</h1>
          <p className="text-muted-foreground">Detalhes da execução do job</p>
        </div>
      </div>
      <JobDetails id={params.id} />
      <JobLogs id={params.id} />
    </div>
  )
}
