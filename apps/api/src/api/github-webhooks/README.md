# GitHub Webhook Comment Interaction

Este documento explica como configurar e usar a funcionalidade de interação em comentários do GitHub onde o bot é mencionado.

## Visão Geral

O BotMaster agora pode responder automaticamente quando é mencionado em comentários de issues no GitHub. Esta funcionalidade permite:

- Detectar quando o bot é mencionado em comentários (`@botmaster`)
- Responder com mensagens configuráveis baseadas em padrões de repositório
- Armazenar histórico de webhooks e respostas
- Configurar respostas específicas por repositório e palavras-chave

## Configuração

### 1. Variáveis de Ambiente

Adicione as seguintes variáveis no arquivo `.env` da API:

```bash
# GitHub Integration
GITHUB_TOKEN="seu_token_do_github_aqui"
GITHUB_WEBHOOK_SECRET="seu_secret_do_webhook_aqui"
GITHUB_BOT_USERNAME="botmaster"
```

- **GITHUB_TOKEN**: Personal Access Token do GitHub com permissões para postar comentários
- **GITHUB_WEBHOOK_SECRET**: (Opcional) Secret para verificar a autenticidade dos webhooks
- **GITHUB_BOT_USERNAME**: Nome do usuário que será detectado nas menções

### 2. Configuração do Webhook no GitHub

1. Vá nas configurações do repositório no GitHub
2. Acesse **Settings > Webhooks > Add webhook**
3. Configure:
   - **Payload URL**: `https://sua-api.com/api/v1/github-webhooks/webhook`
   - **Content type**: `application/json`
   - **Secret**: (Opcional) mesmo valor da variável `GITHUB_WEBHOOK_SECRET`
   - **Events**: Selecione "Issue comments"

### 3. Executar Migrações

Execute as migrações do banco de dados:

```bash
cd apps/api
pnpm migrations up
```

Isso criará as tabelas necessárias e configurações padrão de resposta.

## Como Usar

### Menções Básicas

Simplesmente mencione o bot em qualquer comentário de issue:

```
@botmaster preciso de ajuda com este problema
```

O bot irá responder baseado nas configurações ativas.

### Palavras-chave

Você pode usar palavras-chave específicas para respostas diferentes:

- `@botmaster help` ou `@botmaster ajuda` - Resposta de ajuda geral
- `@botmaster docs` ou `@botmaster documentação` - Links para documentação
- `@botmaster bug` ou `@botmaster erro` - Resposta para reportar bugs

## Configurações de Resposta

### Configurações Padrão

O sistema vem com configurações pré-definidas para:

1. **Repositórios do 1001Josias** (`1001Josias/*`) - Respostas em português com ajuda específica
2. **Repositório BotMaster** (`1001Josias/botmaster`) - Respostas para bugs e problemas
3. **Repositórios Globais** (`*`) - Respostas genéricas para documentação

### API de Configurações

#### Listar Configurações
```bash
GET /api/v1/github-webhooks/configs
```

#### Criar Nova Configuração
```bash
POST /api/v1/github-webhooks/configs
Content-Type: application/json

{
  "repository_pattern": "meuorg/*",
  "mention_keywords": ["help", "ajuda"],
  "response_template": "Olá @{user}! Como posso ajudar com {issue_title}?",
  "enabled": true,
  "priority": 5
}
```

#### Atualizar Configuração
```bash
PUT /api/v1/github-webhooks/configs/{id}
Content-Type: application/json

{
  "enabled": false
}
```

### Templates de Resposta

Os templates suportam as seguintes variáveis:

- `{user}` - Nome do usuário que mencionou o bot
- `{issue_title}` - Título da issue
- `{issue_number}` - Número da issue
- `{repository}` - Nome completo do repositório
- `{comment_url}` - URL do comentário
- `{issue_url}` - URL da issue

## Monitoramento

### Histórico de Webhooks

Visualize todos os webhooks recebidos:

```bash
GET /api/v1/github-webhooks/events
```

Filtre por repositório, tipo de evento, ou status de processamento:

```bash
GET /api/v1/github-webhooks/events?repository=1001Josias/botmaster&bot_mentioned=true
```

### Logs

Os logs da aplicação incluem informações sobre:
- Webhooks recebidos e processados
- Menções detectadas
- Respostas postadas
- Erros de processamento

## Segurança

- **Verificação de Assinatura**: Webhooks são verificados usando HMAC SHA-256
- **Rate Limiting**: Aplicado aos endpoints da API
- **Validação de Dados**: Todos os payloads são validados com Zod schemas
- **Headers de Segurança**: Helmet.js configurado

## Troubleshooting

### Bot não responde

1. Verifique se o webhook está configurado corretamente
2. Confirme que as variáveis de ambiente estão definidas
3. Verifique os logs da aplicação para erros
4. Confirme que existe uma configuração de resposta ativa para o repositório

### Erro de autenticação

1. Verifique se o `GITHUB_TOKEN` tem as permissões necessárias
2. Confirme que o token não expirou
3. Teste o token fazendo uma chamada manual para a API do GitHub

### Webhook não chega

1. Verifique a URL do webhook nas configurações do repositório
2. Confirme que a aplicação está acessível pela internet
3. Verifique se o secret do webhook está correto (se configurado)

## Desenvolvimento

### Testes

Execute os testes:

```bash
cd apps/api
pnpm test src/api/github-webhooks/__tests__/
```

### Estrutura do Código

```
src/api/github-webhooks/
├── __tests__/                    # Testes
├── db/migrations/                # Migrações do banco
├── githubWebhookController.ts    # Controlador HTTP
├── githubWebhookModel.ts         # Modelos e validações Zod
├── githubWebhookOpenAPI.ts       # Documentação OpenAPI
├── githubWebhookRepository.ts    # Acesso ao banco de dados
├── githubWebhookRoutes.ts        # Rotas da API
└── githubWebhookService.ts       # Lógica de negócio
```

### Documentação da API

A documentação completa da API está disponível em `/api-docs/v1` quando a aplicação está rodando.