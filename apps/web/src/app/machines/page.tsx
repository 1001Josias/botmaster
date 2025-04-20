import { MachinesHeader } from "@/components/machines/machines-header"
import { MachinesStats } from "@/components/machines/machines-stats"
import { MachinesList } from "@/components/machines/machines-list"

export default function MachinesPage() {
  return (
    <div className="space-y-6">
      <MachinesHeader />
      <MachinesStats />
      <MachinesList />
    </div>
  )
}

