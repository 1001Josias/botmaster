import { Handle, Position, type NodeProps } from 'reactflow'
import { Square } from 'lucide-react'

export function EndNode({ isConnectable }: NodeProps) {
  return (
    <div className="rounded-md border border-red-500 bg-red-50 p-3 shadow-sm dark:bg-red-950">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="h-3 w-3 bg-red-500" />

      <div className="flex items-center gap-2">
        <Square className="h-4 w-4 text-red-500" />
        <div className="text-sm font-medium text-red-700 dark:text-red-300">End</div>
      </div>
    </div>
  )
}
