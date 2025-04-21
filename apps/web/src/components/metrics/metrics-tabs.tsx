"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OperationalMetrics } from "@/components/metrics/operational-metrics"
import { BusinessMetrics } from "@/components/metrics/business-metrics"
import { StrategicMetrics } from "@/components/metrics/strategic-metrics"
import { QualityMetrics } from "@/components/metrics/quality-metrics"
import { ResourceMetrics } from "@/components/metrics/resource-metrics"

export function MetricsTabs() {
  const [activeTab, setActiveTab] = useState("operational")

  return (
    <Tabs defaultValue="operational" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="operational">Operacionais</TabsTrigger>
        <TabsTrigger value="business">Negócios</TabsTrigger>
        <TabsTrigger value="strategic">Estratégicas</TabsTrigger>
        <TabsTrigger value="quality">Qualidade</TabsTrigger>
        <TabsTrigger value="resource">Recursos</TabsTrigger>
      </TabsList>
      <div className="mt-6">
        <TabsContent value="operational" className="m-0">
          <OperationalMetrics />
        </TabsContent>
        <TabsContent value="business" className="m-0">
          <BusinessMetrics />
        </TabsContent>
        <TabsContent value="strategic" className="m-0">
          <StrategicMetrics />
        </TabsContent>
        <TabsContent value="quality" className="m-0">
          <QualityMetrics />
        </TabsContent>
        <TabsContent value="resource" className="m-0">
          <ResourceMetrics />
        </TabsContent>
      </div>
    </Tabs>
  )
}

