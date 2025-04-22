import { TriggerForm } from '@/components/triggers/triggers-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function TriggerActionPage({ params }: { params: { action: string } }) {
  const isEdit = params.action !== 'new'
  const title = isEdit ? 'Editar Trigger' : 'Novo Trigger'
  const description = isEdit
    ? 'Edite as configurações do trigger existente'
    : 'Configure um novo trigger para iniciar workflows automaticamente'

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/triggers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
      <TriggerForm isEdit={isEdit} triggerId={isEdit ? params.action : undefined} />
    </div>
  )
}
