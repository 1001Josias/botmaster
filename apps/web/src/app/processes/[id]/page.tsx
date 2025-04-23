import { ProcessDetails } from "@/components/processes/process-details"

export default function ProcessDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <ProcessDetails id={params.id} />
    </div>
  )
}

