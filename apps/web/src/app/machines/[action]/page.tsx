import { MachineForm } from '@/components/machines/machine-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function MachineActionPage({ params }: { params: { action: string } }) {
  const isEdit = params.action !== 'new'
  const title = isEdit ? 'Editar Máquina' : 'Nova Máquina'
  const description = isEdit
    ? 'Edite as configurações da máquina existente'
    : 'Configure uma nova máquina para executar jobs através do agente jobmaster'

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/machines">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
      <MachineForm isEdit={isEdit} machineId={isEdit ? params.action : undefined} />
    </div>
  )
}
