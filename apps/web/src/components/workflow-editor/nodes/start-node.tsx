import { Handle, Position, type NodeProps } from 'reactflow'
import { Play } from 'lucide-react'

export function StartNode({ isConnectable }: NodeProps) {
  return (
    <div className="rounded-md border border-green-500 bg-green-50 p-3 shadow-sm dark:bg-green-950">
      <div className="flex items-center gap-2">
        <Play className="h-4 w-4 text-green-500" />
        <div className="text-sm font-medium text-green-700 dark:text-green-300">Start</div>
      </div>

      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="h-3 w-3 bg-green-500" />
    </div>
  )
}
