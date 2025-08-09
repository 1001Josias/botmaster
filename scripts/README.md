# Scripts de Validação

Este diretório contém scripts utilitários para validação de código utilizados pelos pre-commit hooks do projeto.

## Scripts Disponíveis

### 🔍 type-check.js

Executa verificação de tipos TypeScript em todos os workspaces do monorepo.

**Funcionalidades:**

- Detecta automaticamente workspaces com TypeScript
- Executa `tsc --noEmit` em cada workspace
- Valida configurações do tsconfig.json
- Fornece recomendações de configuração

**Uso:**

```bash
node scripts/type-check.js
```

### 🔒 security-scan.js

Executa verificações de segurança no código e dependências.

**Funcionalidades:**

- Verifica arquivos de ambiente (.env)
- Detecta possíveis secrets hardcoded
- Executa audit de vulnerabilidades npm
- Valida permissões dos git hooks

**Uso:**

```bash
node scripts/security-scan.js
```

### 📦 bundle-analyzer.js

Analisa o tamanho dos bundles e dependências.

**Funcionalidades:**

- Verifica limites de tamanho de bundle por workspace
- Detecta dependências desatualizadas
- Analisa problemas de dependências duplicadas
- Fornece sugestões de otimização

**Configuração de limites (em KB):**

- `apps/web`: JS: 500KB, CSS: 100KB, Total: 600KB
- `apps/docs`: JS: 300KB, CSS: 80KB, Total: 380KB
- `apps/jobmaster-gui`: JS: 400KB, CSS: 120KB, Total: 520KB
- `packages/ui`: JS: 200KB, CSS: 150KB, Total: 350KB

**Uso:**

```bash
node scripts/bundle-analyzer.js
```

## Integração com Pre-commit Hooks

Estes scripts são automaticamente executados pelos hooks configurados:

- **pre-commit**: `type-check.js` (via lint-staged)
- **pre-push**: `security-scan.js` e `bundle-analyzer.js`

## Desenvolvimento

### Adicionando Novos Scripts

1. Crie o script em `scripts/`
2. Torne-o executável: `chmod +x scripts/novo-script.js`
3. Adicione ao início do arquivo: `#!/usr/bin/env node`
4. Integre aos hooks relevantes
5. Atualize este README

### Modificando Limites de Bundle

Para ajustar os limites de bundle, edite a constante `BUNDLE_LIMITS` em `bundle-analyzer.js`.

### Configurando Novos Workspaces

Os scripts detectam automaticamente novos workspaces baseados na estrutura de pastas:

- `apps/*` - Aplicações
- `packages/*` - Pacotes compartilhados

## Execução Manual

Todos os scripts podem ser executados manualmente para debugging:

```bash
# Verificação de tipos
npm run type-check

# Scan de segurança
npm run security:scan

# Análise de bundle
npm run bundle:analyze
```

## Solução de Problemas

### Type Check Falha

- Verifique erros de TypeScript nos workspaces
- Certifique-se que `tsconfig.json` está válido
- Execute `npx tsc --noEmit` no workspace específico

### Security Scan com Warnings

- Revise arquivos flagrados com possíveis secrets
- Execute `npm audit fix` para corrigir vulnerabilidades
- Verifique se arquivos .env estão no .gitignore

### Bundle Size Excedido

- Use code splitting
- Remova dependências não utilizadas
- Implemente tree shaking
- Considere lazy loading
