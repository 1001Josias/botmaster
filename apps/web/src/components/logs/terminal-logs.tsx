'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/Button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChevronDown, ChevronUp, Copy, Download, XCircle, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LogEntry {
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'debug'
  message: string
  jobId?: string
  jobName?: string
}

interface TerminalLogsProps {
  logs: LogEntry[]
  title?: string
  showJobInfo?: boolean
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  className?: string
}

export function TerminalLogs({
  logs,
  title = 'Logs',
  showJobInfo = false,
  isOpen: externalIsOpen,
  onOpenChange,
  className,
}: TerminalLogsProps) {
  const [isOpen, setIsOpen] = useState(externalIsOpen ?? false)
  const [activeTab, setActiveTab] = useState<string>('all')
  const [autoScroll, setAutoScroll] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Sync with external state if provided
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setIsOpen(externalIsOpen)
    }
  }, [externalIsOpen])

  const handleToggle = () => {
    const newState = !isOpen
    setIsOpen(newState)
    onOpenChange?.(newState)
  }

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll && scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current
      scrollArea.scrollTop = scrollArea.scrollHeight
    }
  }, [logs, autoScroll])

  const copyLogs = () => {
    const logText = logs
      .map(
        (log) =>
          `[${log.timestamp}] [${log.level.toUpperCase()}] ${showJobInfo && log.jobName ? `[${log.jobName}] ` : ''}${log.message}`
      )
      .join('\n')
    navigator.clipboard.writeText(logText)
  }

  const downloadLogs = () => {
    const logText = logs
      .map(
        (log) =>
          `[${log.timestamp}] [${log.level.toUpperCase()}] ${showJobInfo && log.jobName ? `[${log.jobName}] ` : ''}${log.message}`
      )
      .join('\n')
    const blob = new Blob([logText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `logs-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Get unique job IDs for filtering
  const jobIds = showJobInfo ? Array.from(new Set(logs.filter((log) => log.jobId).map((log) => log.jobId))) : []

  // Filter logs based on active tab
  const filteredLogs =
    activeTab === 'all' ? logs : logs.filter((log) => log.jobId === activeTab || log.level === activeTab)

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info':
        return 'text-blue-500 dark:text-blue-400'
      case 'warning':
        return 'text-yellow-500 dark:text-yellow-400'
      case 'error':
        return 'text-red-500 dark:text-red-400'
      case 'debug':
        return 'text-gray-500 dark:text-gray-400'
      default:
        return 'text-foreground'
    }
  }

  return (
    <div className={cn('fixed bottom-0 left-0 right-0 z-50 border-t bg-background', className)}>
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleToggle}>
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
          <h3 className="text-sm font-medium">{title}</h3>
          {!isOpen && (
            <span className="text-xs text-muted-foreground">
              {logs.length} {logs.length === 1 ? 'entrada' : 'entradas'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {isOpen && (
            <>
              <Button variant="ghost" size="icon" onClick={copyLogs} title="Copiar logs">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={downloadLogs} title="Baixar logs">
                <Download className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" onClick={handleToggle} title="Fechar">
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="flex flex-col">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between border-b px-4">
              <TabsList className="h-9">
                <TabsTrigger value="all" className="text-xs">
                  Todos
                </TabsTrigger>
                <TabsTrigger value="info" className="text-xs">
                  Info
                </TabsTrigger>
                <TabsTrigger value="warning" className="text-xs">
                  Warning
                </TabsTrigger>
                <TabsTrigger value="error" className="text-xs">
                  Error
                </TabsTrigger>
                <TabsTrigger value="debug" className="text-xs">
                  Debug
                </TabsTrigger>
                {showJobInfo && jobIds.length > 0 && (
                  <TabsTrigger value="jobs" className="text-xs">
                    <Filter className="mr-1 h-3 w-3" />
                    Jobs
                  </TabsTrigger>
                )}
              </TabsList>
              <div className="flex items-center">
                <label className="flex items-center gap-1.5 text-xs">
                  <input
                    type="checkbox"
                    checked={autoScroll}
                    onChange={(e) => setAutoScroll(e.target.checked)}
                    className="h-3 w-3"
                  />
                  Auto-scroll
                </label>
              </div>
            </div>

            <TabsContent value="jobs" className="m-0">
              <div className="flex flex-wrap gap-1 p-2 border-b">
                {jobIds.map((jobId) => {
                  const job = logs.find((log) => log.jobId === jobId)
                  return (
                    <Button
                      key={jobId}
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setActiveTab(jobId!)}
                    >
                      {job?.jobName || jobId}
                    </Button>
                  )
                })}
              </div>
            </TabsContent>

            <div className="relative">
              <ScrollArea ref={scrollAreaRef} className="h-[300px] font-mono text-xs">
                <div className="p-4 space-y-1">
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log, index) => (
                      <div key={index} className="flex">
                        <span className="text-muted-foreground">[{log.timestamp}]</span>
                        <span className={cn('ml-2', getLevelColor(log.level))}>[{log.level.toUpperCase()}]</span>
                        {showJobInfo && log.jobName && (
                          <span className="ml-2 text-purple-500 dark:text-purple-400">[{log.jobName}]</span>
                        )}
                        <span className="ml-2 whitespace-pre-wrap break-all">{log.message}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-4">Nenhum log encontrado</div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </Tabs>
        </div>
      )}
    </div>
  )
}
