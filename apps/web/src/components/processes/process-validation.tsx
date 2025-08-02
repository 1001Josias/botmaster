'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface ProcessValidationProps {
  issues: string[]
  onValidate: () => boolean
}

export function ProcessValidation({ issues, onValidate }: ProcessValidationProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Process Validation</CardTitle>
        <Button variant="outline" size="sm" onClick={onValidate}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Validate
        </Button>
      </CardHeader>
      <CardContent>
        {issues.length === 0 ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-700">All good!</AlertTitle>
            <AlertDescription className="text-green-600">
              Your process is valid and ready to be published.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Validation Issues</AlertTitle>
              <AlertDescription>Please fix the following issues before publishing the process.</AlertDescription>
            </Alert>
            <div className="space-y-2">
              {issues.map((issue, index) => (
                <div key={index} className="rounded-md border border-red-200 bg-red-50 p-3">
                  <p className="text-sm text-red-700">{issue}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
