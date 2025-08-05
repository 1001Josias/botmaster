import { ProcessImplementation } from '@/components/processes/process-implementation'

export default function ProcessImplementationPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <ProcessImplementation id={params.id} />
    </div>
  )
}
