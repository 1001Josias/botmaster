import { Handle, Position, type NodeProps } from "reactflow"
import { CheckCircle } from "lucide-react"

export function EndNode({ data, isConnectable }: NodeProps) {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white shadow-md">
      <CheckCircle className="h-6 w-6" />
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#64748b", width: "10px", height: "10px" }}
        isConnectable={isConnectable}
      />
    </div>
  )
}

