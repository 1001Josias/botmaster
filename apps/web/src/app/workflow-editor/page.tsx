import { WorkflowEditor } from "@/components/workflow-editor/workflow-editor"

export default function WorkflowEditorPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col space-y-4 p-4">
      <WorkflowEditor />
    </div>
  )
}

