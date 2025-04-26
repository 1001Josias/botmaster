import { WorkerDetails } from '@/components/workers/worker-details'

interface WorkerDetailsPageProps {
  params: {
    id: string
  }
}

export default function WorkerDetailsPage({ params }: WorkerDetailsPageProps) {
  return <WorkerDetails id={params.id} />
}
