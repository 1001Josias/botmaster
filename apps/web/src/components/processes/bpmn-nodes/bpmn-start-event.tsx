import { Handle, Position } from "reactflow"

export function BpmnStartEvent({ data, selected }: { data: any; selected: boolean }) {
  return (
    <div className="relative">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full border-2 bg-green-100 ${
          selected ? "border-blue-500" : "border-green-500"
        }`}
      >
        <div className="text-xs font-medium">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Right} className="h-3 w-3 rounded-full border-2 bg-white" />
    </div>
  )
}

