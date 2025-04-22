import { Handle, Position } from "reactflow"
import { AlertCircle } from "lucide-react"

export function BpmnErrorEvent({ data, selected }: { data: any; selected: boolean }) {
  return (
    <div className="relative">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full border-2 bg-yellow-100 ${
          selected ? "border-blue-500" : "border-yellow-300"
        }`}
      >
        <AlertCircle className="h-6 w-6" />
      </div>
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-medium">{data.label}</div>
      <Handle type="target" position={Position.Left} className="h-3 w-3 rounded-full border-2 bg-white" />
      <Handle type="source" position={Position.Right} className="h-3 w-3 rounded-full border-2 bg-white" />
    </div>
  )
}

