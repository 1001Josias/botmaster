import { WebhookForm } from '@/components/webhooks/webhook-form'
import { notFound } from 'next/navigation'

export default function WebhookActionPage({ params }: { params: { action: string } }) {
  // Validate action parameter
  if (params.action !== 'new' && params.action !== 'edit') {
    notFound()
  }

  const isEditing = params.action === 'edit'

  return (
    <div className="flex flex-col gap-6 p-6">
      <WebhookForm isEditing={isEditing} />
    </div>
  )
}
