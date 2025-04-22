import { Handle, Position } from "reactflow"
import { FileText } from "lucide-react"

export function BpmnBusinessRuleTask({ data, selected }: { data: any; selected: boolean }) {
  return (
    <div className="relative">
      <div
        className={`flex h-14 w-36 items-center justify-center rounded-md border-2 bg-amber-100 ${
          selected ? "border-blue-500" : "border-amber-300"
        }`}
      >
        <FileText className="mr-2 h-4 w-4" />
        <div className="text-xs font-medium">{data.label}</div>
      </div>
      <Handle type="target" position={Position.Left} className="h-3 w-3 rounded-full border-2 bg-white" />
      <Handle type="source" position={Position.Right} className="h-3 w-3 rounded-full border-2 bg-white" />
    </div>
  )
}

