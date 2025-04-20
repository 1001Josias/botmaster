'use client'

import { useState } from 'react'
import { TerminalLogs } from '@/components/logs/terminal-logs'

interface FlowLogsProps {
  id: string
}

export function FlowLogs({ id }: FlowLogsProps) {
  const [isOpen, setIsOpen] = useState(true)

  // Dados de exemplo - em uma aplicação real, estes dados viriam de uma API
  const logs = [
    // Job 1: Validação de Pedido
    {
      timestamp: '2023-03-15 14:30:00.123',
      level: 'info',
      message: 'Iniciando validação do pedido #789',
      jobId: 'JOB-001',
      jobName: 'Validação de Pedido',
    },
    {
      timestamp: '2023-03-15 14:30:00.234',
      level: 'debug',
      message: 'Verificando dados do cliente',
      jobId: 'JOB-001',
      jobName: 'Validação de Pedido',
    },
    {
      timestamp: '2023-03-15 14:30:00.345',
      level: 'info',
      message: 'Dados do cliente validados com sucesso',
      jobId: 'JOB-001',
      jobName: 'Validação de Pedido',
    },
    {
      timestamp: '2023-03-15 14:30:00.456',
      level: 'info',
      message: 'Validação de pedido concluída com sucesso',
      jobId: 'JOB-001',
      jobName: 'Validação de Pedido',
    },

    // Job 2: Verificação de Estoque
    {
      timestamp: '2023-03-15 14:30:00.567',
      level: 'info',
      message: 'Iniciando verificação de estoque para pedido #789',
      jobId: 'JOB-002',
      jobName: 'Verificação de Estoque',
    },
    {
      timestamp: '2023-03-15 14:30:00.678',
      level: 'debug',
      message: 'Consultando banco de dados de estoque',
      jobId: 'JOB-002',
      jobName: 'Verificação de Estoque',
    },
    {
      timestamp: '2023-03-15 14:30:00.789',
      level: 'warning',
      message: 'Produto ID-456 com estoque baixo (3 unidades)',
      jobId: 'JOB-002',
      jobName: 'Verificação de Estoque',
    },
    {
      timestamp: '2023-03-15 14:30:00.890',
      level: 'info',
      message: 'Todos os produtos disponíveis em estoque',
      jobId: 'JOB-002',
      jobName: 'Verificação de Estoque',
    },
    {
      timestamp: '2023-03-15 14:30:01.001',
      level: 'info',
      message: 'Verificação de estoque concluída com sucesso',
      jobId: 'JOB-002',
      jobName: 'Verificação de Estoque',
    },

    // Job 3: Processamento de Pagamento
    {
      timestamp: '2023-03-15 14:30:01.112',
      level: 'info',
      message: 'Iniciando processamento de pagamento para pedido #789',
      jobId: 'JOB-003',
      jobName: 'Processamento de Pagamento',
    },
    {
      timestamp: '2023-03-15 14:30:01.223',
      level: 'debug',
      message: 'Conectando à gateway de pagamento',
      jobId: 'JOB-003',
      jobName: 'Processamento de Pagamento',
    },
    {
      timestamp: '2023-03-15 14:30:01.334',
      level: 'debug',
      message: 'Enviando requisição de autorização',
      jobId: 'JOB-003',
      jobName: 'Processamento de Pagamento',
    },
    {
      timestamp: '2023-03-15 14:30:01.445',
      level: 'info',
      message: 'Pagamento autorizado com sucesso. ID da transação: TRX-123456',
      jobId: 'JOB-003',
      jobName: 'Processamento de Pagamento',
    },
    {
      timestamp: '2023-03-15 14:30:01.556',
      level: 'info',
      message: 'Processamento de pagamento concluído com sucesso',
      jobId: 'JOB-003',
      jobName: 'Processamento de Pagamento',
    },

    // Job 4: Reserva de Estoque
    {
      timestamp: '2023-03-15 14:30:01.667',
      level: 'info',
      message: 'Iniciando reserva de estoque para pedido #789',
      jobId: 'JOB-004',
      jobName: 'Reserva de Estoque',
    },
    {
      timestamp: '2023-03-15 14:30:01.778',
      level: 'debug',
      message: 'Atualizando banco de dados de estoque',
      jobId: 'JOB-004',
      jobName: 'Reserva de Estoque',
    },
    {
      timestamp: '2023-03-15 14:30:01.889',
      level: 'info',
      message: 'Estoque reservado com sucesso',
      jobId: 'JOB-004',
      jobName: 'Reserva de Estoque',
    },

    // Job 5: Geração de Nota Fiscal
    {
      timestamp: '2023-03-15 14:30:02.000',
      level: 'info',
      message: 'Iniciando geração de nota fiscal para pedido #789',
      jobId: 'JOB-005',
      jobName: 'Geração de Nota Fiscal',
    },
    {
      timestamp: '2023-03-15 14:30:02.111',
      level: 'debug',
      message: 'Calculando impostos',
      jobId: 'JOB-005',
      jobName: 'Geração de Nota Fiscal',
    },
    {
      timestamp: '2023-03-15 14:30:02.222',
      level: 'debug',
      message: 'Gerando XML da nota fiscal',
      jobId: 'JOB-005',
      jobName: 'Geração de Nota Fiscal',
    },
    {
      timestamp: '2023-03-15 14:30:02.333',
      level: 'info',
      message: 'Enviando nota fiscal para autorização',
      jobId: 'JOB-005',
      jobName: 'Geração de Nota Fiscal',
    },
    {
      timestamp: '2023-03-15 14:30:02.444',
      level: 'info',
      message: 'Nota fiscal autorizada com sucesso. Número: NF-987654',
      jobId: 'JOB-005',
      jobName: 'Geração de Nota Fiscal',
    },

    // Job 6: Criação de Etiqueta
    {
      timestamp: '2023-03-15 14:30:02.555',
      level: 'info',
      message: 'Iniciando criação de etiqueta para pedido #789',
      jobId: 'JOB-006',
      jobName: 'Criação de Etiqueta',
    },
    {
      timestamp: '2023-03-15 14:30:02.666',
      level: 'debug',
      message: 'Calculando dimensões e peso do pacote',
      jobId: 'JOB-006',
      jobName: 'Criação de Etiqueta',
    },
    {
      timestamp: '2023-03-15 14:30:02.777',
      level: 'debug',
      message: 'Gerando código de rastreamento',
      jobId: 'JOB-006',
      jobName: 'Criação de Etiqueta',
    },
    {
      timestamp: '2023-03-15 14:30:02.888',
      level: 'info',
      message: 'Etiqueta criada com sucesso. Código de rastreamento: TRACK-123456',
      jobId: 'JOB-006',
      jobName: 'Criação de Etiqueta',
    },

    // Job 7: Notificação de Envio
    {
      timestamp: '2023-03-15 14:30:02.999',
      level: 'info',
      message: 'Iniciando notificação de envio para pedido #789',
      jobId: 'JOB-007',
      jobName: 'Notificação de Envio',
    },
    {
      timestamp: '2023-03-15 14:30:03.110',
      level: 'debug',
      message: 'Preparando email de notificação',
      jobId: 'JOB-007',
      jobName: 'Notificação de Envio',
    },
    {
      timestamp: '2023-03-15 14:30:03.221',
      level: 'info',
      message: 'Email de notificação enviado para cliente@exemplo.com',
      jobId: 'JOB-007',
      jobName: 'Notificação de Envio',
    },

    // Job 8: Atualização de Status
    {
      timestamp: '2023-03-15 14:30:03.332',
      level: 'info',
      message: 'Iniciando atualização de status do pedido #789',
      jobId: 'JOB-008',
      jobName: 'Atualização de Status',
    },
    {
      timestamp: '2023-03-15 14:30:03.443',
      level: 'debug',
      message: 'Atualizando status no banco de dados',
      jobId: 'JOB-008',
      jobName: 'Atualização de Status',
    },
    {
      timestamp: '2023-03-15 14:30:03.554',
      level: 'info',
      message: "Status do pedido atualizado para 'Em Processamento'",
      jobId: 'JOB-008',
      jobName: 'Atualização de Status',
    },
    {
      timestamp: '2023-03-15 14:30:03.665',
      level: 'info',
      message: 'Flow de processamento de pedido concluído com sucesso',
      jobId: 'JOB-008',
      jobName: 'Atualização de Status',
    },
  ] as any[]

  return (
    <TerminalLogs
      logs={logs}
      title={`Logs do Flow ${id}`}
      showJobInfo={true}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    />
  )
}
