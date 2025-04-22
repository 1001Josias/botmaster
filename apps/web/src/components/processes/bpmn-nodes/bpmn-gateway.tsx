import { Handle, Position } from "reactflow"

export function BpmnGateway({ data, selected }: { data: any; selected: boolean }) {
  const getGatewayColor = () => {
    switch (data.type) {
      case "exclusiveGateway":
        return "border-yellow-500 bg-yellow-100"
      case "parallelGateway":
        return "border-green-500 bg-green-100"
      case "inclusiveGateway":
        return "border-blue-500 bg-blue-100"
      case "eventGateway":
        return "border-purple-500 bg-purple-100"
      default:
        return "border-gray-500 bg-gray-100"
    }
  }

  const getGatewayIcon = () => {
    switch (data.type) {
      case "exclusiveGateway":
        return "×"
      case "parallelGateway":
        return "+"
      case "inclusiveGateway":
        return "○"
      case "eventGateway":
        return "◇"
      default:
        return ""
    }
  }

  return (
    <div className="relative">
      <div
        className={`flex h-14 w-14 rotate-45 items-center justify-center border-2 ${
          selected ? "border-blue-500" : getGatewayColor()
        }`}
      >
        <div className="-rotate-45 text-lg font-bold">{getGatewayIcon()}</div>
      </div>
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-medium">{data.label}</div>
      <Handle type="target" position={Position.Top} className="h-3 w-3 rounded-full border-2 bg-white" />
      <Handle type="source" position={Position.Bottom} className="h-3 w-3 rounded-full border-2 bg-white" />
      <Handle type="source" position={Position.Right} className="h-3 w-3 rounded-full border-2 bg-white" />
      <Handle type="target" position={Position.Left} className="h-3 w-3 rounded-full border-2 bg-white" />
    </div>
  )
}

