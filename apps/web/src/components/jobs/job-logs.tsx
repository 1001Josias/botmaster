'use client'

import { useState } from 'react'
import { TerminalLogs } from '@/components/logs/terminal-logs'

interface JobLogsProps {
  id: string
}

export function JobLogs({ id }: JobLogsProps) {
  const [isOpen, setIsOpen] = useState(true)

  // Dados de exemplo - em uma aplicação real, estes dados viriam de uma API
  const logs = [
    {
      timestamp: '2023-03-15 14:30:00.123',
      level: 'info',
      message: 'Iniciando job de processamento de email',
    },
    {
      timestamp: '2023-03-15 14:30:00.145',
      level: 'debug',
      message: "Carregando template 'order-confirmation'",
    },
    {
      timestamp: '2023-03-15 14:30:00.256',
      level: 'debug',
      message: 'Template carregado com sucesso',
    },
    {
      timestamp: '2023-03-15 14:30:00.345',
      level: 'info',
      message: 'Preparando email para cliente@exemplo.com',
    },
    {
      timestamp: '2023-03-15 14:30:00.456',
      level: 'debug',
      message: 'Substituindo variáveis no template',
    },
    {
      timestamp: '2023-03-15 14:30:00.567',
      level: 'debug',
      message: 'Anexando detalhes do pedido #789',
    },
    {
      timestamp: '2023-03-15 14:30:00.678',
      level: 'warning',
      message: 'Imagem do produto não encontrada, usando imagem padrão',
    },
    {
      timestamp: '2023-03-15 14:30:00.789',
      level: 'info',
      message: 'Conectando ao servidor SMTP',
    },
    {
      timestamp: '2023-03-15 14:30:00.890',
      level: 'debug',
      message: 'Conexão SMTP estabelecida',
    },
    {
      timestamp: '2023-03-15 14:30:00.901',
      level: 'info',
      message: 'Enviando email',
    },
    {
      timestamp: '2023-03-15 14:30:01.012',
      level: 'info',
      message: 'Email enviado com sucesso. ID da mensagem: MSG123456',
    },
    {
      timestamp: '2023-03-15 14:30:01.123',
      level: 'info',
      message: 'Job concluído com sucesso',
    },
  ] as any[]

  return <TerminalLogs logs={logs} title={`Logs do Job ${id}`} isOpen={isOpen} onOpenChange={setIsOpen} />
}
