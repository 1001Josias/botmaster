import { Handle, Position, type NodeProps } from "reactflow"
import { PlayCircle } from "lucide-react"

export function StartNode({ data, isConnectable }: NodeProps) {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-md">
      <PlayCircle className="h-6 w-6" />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#64748b", width: "10px", height: "10px" }}
        isConnectable={isConnectable}
      />
    </div>
  )
}

