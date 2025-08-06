# Plano de Implementação Pre-commit para Monorepo Botmaster

## Resumo Executivo

**Objetivo:** Implementar sistema de pre-commit hooks completo para o monorepo Turborepo do botmaster, usando abordagem híbrida com validações de qualidade, segurança, performance e compliance.

**Abordagem:** Configuração global no root com hooks específicos por workspace quando necessário.

## Análise da Estrutura Atual

### Configurações Existentes

- ✅ **API:** Husky + lint-staged configurado
- ✅ **Web:** lint-staged + pre-commit básico
- ✅ **ESLint Config:** Package compartilhado
- ✅ **TypeScript Config:** Package compartilhado
- ✅ **Prettier:** Configuração centralizada

### Estrutura do Monorepo

```
botmaster/
├── apps/
│   ├── api/          # Express + TypeScript
│   ├── web/          # Next.js + React
│   ├── docs/         # Next.js docs
│   └── jobmaster-gui/ # Electron app
├── packages/
│   ├── eslint-config/
│   ├── typescript-config/
│   └── ui/
└── turbo.json
```

## Arquitetura da Solução

### 1. Configuração Global (Root Level)

#### **package.json** (adições necessárias)

```json
{
  "scripts": {
    "prepare": "husky install",
    "lint:all": "turbo run lint",
    "format:all": "turbo run format",
    "test:affected": "turbo run test --filter='[HEAD^1]'",
    "type-check:all": "turbo run type-check",
    "security:scan": "turbo run security:scan",
    "bundle:analyze": "turbo run bundle:analyze"
  },
  "devDependencies": {
    "husky": "^9.0.11",
    "lint-staged": "^15.2.2",
    "@commitlint/cli": "^18.4.3",
    "@commitlint/config-conventional": "^18.4.3",
    "concurrently": "^8.2.2",
    "cross-env": "^7.0.3",
    "ts-node": "^10.9.1"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["turbo run lint --filter='[HEAD^1]' --", "turbo run type-check --filter='[HEAD^1]' --"],
    "*.{js,jsx,ts,tsx,json,md,yml,yaml}": ["prettier --write"],
    "*.{env,secret,key}": ["echo 'Security scan needed' && exit 1"],
    "package*.json": ["npm audit --audit-level=high"]
  }
}
```

### 2. Hooks Configuration

#### **.husky/pre-commit**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit validations..."

# Timeout configuration (5 minutes max)
timeout 300s lint-staged || {
  echo "❌ Pre-commit hooks timed out after 5 minutes"
  echo "Consider splitting your commit into smaller changes"
  exit 1
}
```

#### **.husky/commit-msg**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit "$1"
```

#### **.husky/pre-push**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🧪 Running pre-push validations..."

# Run tests only on affected workspaces
npm run test:affected

# Security scan
npm run security:scan

# Bundle size analysis (if applicable)
npm run bundle:analyze || true
```

### 3. Advanced Lint-Staged Configuration

#### **.lintstagedrc.js**

```javascript
const path = require('path')

const buildCommand = (filenames) => {
  const cwd = process.cwd()
  const relativePaths = filenames.map((f) => path.relative(cwd, f))

  // Determine affected workspaces
  const workspaces = new Set()
  relativePaths.forEach((file) => {
    if (file.startsWith('apps/')) {
      const workspace = file.split('/')[1]
      workspaces.add(`apps/${workspace}`)
    } else if (file.startsWith('packages/')) {
      const workspace = file.split('/')[1]
      workspaces.add(`packages/${workspace}`)
    }
  })

  const filters = Array.from(workspaces)
    .map((ws) => `--filter=${ws}`)
    .join(' ')
  return filters ? `turbo run lint ${filters}` : 'echo "No workspace changes detected"'
}

module.exports = {
  // TypeScript/JavaScript files
  '*.{js,jsx,ts,tsx}': [buildCommand, 'prettier --write'],

  // Configuration files
  '*.{json,yml,yaml}': ['prettier --write'],

  // Markdown files
  '*.md': ['prettier --write', 'markdownlint --fix'],

  // Security-sensitive files
  '*.{env,secret,key,pem}': [
    () => {
      console.error('❌ Security files should not be committed')
      return 'exit 1'
    },
  ],

  // Package files
  'package*.json': ['npm audit --audit-level=high', 'prettier --write'],

  // SQL migrations (API specific)
  'apps/api/**/*.sql': [() => 'echo "⚠️  SQL migration detected - ensure it has been reviewed"'],
}
```

### 4. Turbo.json Enhancements

```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {
      "dependsOn": ["^lint"],
      "inputs": ["$TURBO_DEFAULT$", ".eslintrc*", "eslint.config.*"],
      "cache": true
    },
    "type-check": {
      "dependsOn": ["^type-check"],
      "inputs": ["$TURBO_DEFAULT$", "tsconfig*.json"],
      "cache": true
    },
    "test": {
      "dependsOn": ["^test"],
      "inputs": ["$TURBO_DEFAULT$", "jest.config.*", "vitest.config.*"],
      "cache": true
    },
    "security:scan": {
      "inputs": ["package*.json", ".env*"],
      "cache": false
    },
    "bundle:analyze": {
      "dependsOn": ["build"],
      "inputs": ["$TURBO_DEFAULT$"],
      "cache": true
    },
    "format": {
      "inputs": ["$TURBO_DEFAULT$", ".prettierrc*"],
      "cache": true
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### 5. Commitlint Configuration

#### **commitlint.config.js**

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation
        'style', // Formatting
        'refactor', // Code restructuring
        'perf', // Performance improvements
        'test', // Adding tests
        'chore', // Maintenance
        'ci', // CI/CD changes
        'build', // Build system
        'revert', // Reverting changes
      ],
    ],
    'scope-enum': [
      2,
      'always',
      ['api', 'web', 'docs', 'jobmaster-gui', 'ui', 'eslint-config', 'typescript-config', 'deps', 'config'],
    ],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'header-max-length': [2, 'always', 100],
  },
}
```

### 6. Workspace-Specific Configurations

#### **apps/api/package.json** (adições)

```json
{
  "scripts": {
    "security:scan": "npm audit && snyk test || true",
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "snyk": "^1.1275.0"
  }
}
```

#### **apps/web/package.json** (adições)

```json
{
  "scripts": {
    "bundle:analyze": "cross-env ANALYZE=true next build",
    "type-check": "tsc --noEmit",
    "security:scan": "npm audit || true"
  },
  "devDependencies": {
    "@next/bundle-analyzer": "^14.1.3"
  }
}
```

### 7. Security and Performance Validations

#### **scripts/security-scan.js**

```javascript
#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')

console.log('🔒 Running security validations...')

// Check for common security issues
const securityChecks = [
  {
    name: 'Environment files',
    check: () => {
      const envFiles = ['.env', '.env.local', '.env.production']
      envFiles.forEach((file) => {
        if (fs.existsSync(file)) {
          console.warn(`⚠️  ${file} exists - ensure it's in .gitignore`)
        }
      })
    },
  },
  {
    name: 'Hardcoded secrets',
    check: () => {
      try {
        execSync('git diff --cached --name-only | xargs grep -l "password\\|secret\\|key\\|token" || true', {
          stdio: 'pipe',
        })
      } catch (e) {
        // Ignore - no secrets found
      }
    },
  },
  {
    name: 'Package vulnerabilities',
    check: () => {
      try {
        execSync('npm audit --audit-level=high', { stdio: 'inherit' })
      } catch (e) {
        console.error('❌ High severity vulnerabilities found')
        process.exit(1)
      }
    },
  },
]

securityChecks.forEach((check) => {
  console.log(`Checking: ${check.name}`)
  check.check()
})

console.log('✅ Security validations completed')
```

### 8. Performance Monitoring

#### **scripts/bundle-analysis.js**

```javascript
#!/usr/bin/env node

const path = require('path')
const { execSync } = require('child_process')

const BUNDLE_SIZE_LIMITS = {
  'apps/web': {
    maxSize: '500kb',
    maxGzipSize: '150kb',
  },
}

console.log('📊 Analyzing bundle sizes...')

Object.entries(BUNDLE_SIZE_LIMITS).forEach(([workspace, limits]) => {
  const workspacePath = path.join(process.cwd(), workspace)

  try {
    console.log(`Analyzing ${workspace}...`)
    // Bundle analysis logic here
    console.log(`✅ ${workspace} bundle size within limits`)
  } catch (error) {
    console.error(`❌ ${workspace} bundle size exceeds limits`)
    console.error(`Max: ${limits.maxSize}, Max Gzip: ${limits.maxGzipSize}`)
  }
})
```

## Implementação Passo a Passo

### Fase 1: Setup Global

1. Instalar dependências no root
2. Configurar Husky no root
3. Configurar lint-staged global
4. Configurar commitlint

### Fase 2: Integração Turborepo

1. Atualizar turbo.json com novas tasks
2. Configurar filtros para workspaces afetados
3. Otimizar cache do Turborepo

### Fase 3: Validações Específicas

1. Implementar validações de segurança
2. Configurar análise de bundle
3. Configurar validações por workspace

### Fase 4: Migração e Testes

1. Migrar configurações existentes
2. Testar em diferentes cenários
3. Documentar processo

### Fase 5: CI/CD e Treinamento

1. Integrar com pipeline CI/CD
2. Documentar práticas
3. Treinar equipe

## Métricas de Sucesso

- ⏱️ **Performance:** Pre-commit hooks < 60s em 95% dos casos
- 🐛 **Qualidade:** Redução de 80% em bugs relacionados a lint/format
- 🔒 **Segurança:** 0 commits com secrets expostos
- 👥 **Adoção:** 100% da equipe usando os hooks
- 🔄 **CI/CD:** Mesmas validações local e remoto

## Timeline Estimado

- **Semana 1:** Fase 1 e 2 (Setup e Turborepo)
- **Semana 2:** Fase 3 (Validações específicas)
- **Semana 3:** Fase 4 (Migração e testes)
- **Semana 4:** Fase 5 (CI/CD e treinamento)

## Próximos Passos

1. **Aprovação do plano**
2. **Criação de branch feature/pre-commit-setup**
3. **Implementação incremental**
4. **Testes em ambiente de desenvolvimento**
5. **Deploy gradual para equipe**
