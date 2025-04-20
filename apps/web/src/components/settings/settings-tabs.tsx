'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GeneralSettings } from '@/components/settings/general-settings'
import { SecuritySettings } from '@/components/settings/security-settings'
import { ApiSettings } from '@/components/settings/api-settings'
import { NotificationSettings } from '@/components/settings/notification-settings'

export function SettingsTabs() {
  const [activeTab, setActiveTab] = useState('general')

  return (
    <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="general">Geral</TabsTrigger>
        <TabsTrigger value="security">Segurança</TabsTrigger>
        <TabsTrigger value="api">API</TabsTrigger>
        <TabsTrigger value="notifications">Notificações</TabsTrigger>
      </TabsList>
      <Card className="mt-4">
        <CardContent className="pt-6">
          <TabsContent value="general" className="mt-0">
            <GeneralSettings />
          </TabsContent>
          <TabsContent value="security" className="mt-0">
            <SecuritySettings />
          </TabsContent>
          <TabsContent value="api" className="mt-0">
            <ApiSettings />
          </TabsContent>
          <TabsContent value="notifications" className="mt-0">
            <NotificationSettings />
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  )
}
