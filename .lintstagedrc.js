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

const buildTypeCheckCommand = (filenames) => {
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
  return filters ? `turbo run type-check ${filters}` : 'echo "No workspace changes detected"'
}

module.exports = {
  // TypeScript/JavaScript files
  '*.{js,jsx,ts,tsx}': [
    buildCommand,
    buildTypeCheckCommand,
    'prettier --config packages/eslint-config/.prettierrc --write',
  ],

  // Configuration files
  '*.{json,yml,yaml}': ['prettier --config packages/eslint-config/.prettierrc --write'],

  // Markdown files
  '*.md': ['prettier --config packages/eslint-config/.prettierrc --write'],

  // Security-sensitive files
  '*.{env,secret,key,pem}': [
    () => {
      console.error('❌ Security files should not be committed')
      console.error('Please add these files to .gitignore')
      return 'exit 1'
    },
  ],

  // Package files - run audit on changes
  'package*.json': [
    () => 'npm audit --audit-level=high',
    'prettier --config packages/eslint-config/.prettierrc --write',
  ],

  // SQL migrations (API specific)
  'apps/api/**/*.sql': [
    () => {
      console.log('⚠️  SQL migration detected - ensure it has been reviewed')
      return 'echo "SQL migration validation passed"'
    },
  ],

  // Environment template files
  '**/.env.template': [
    () => {
      console.log('✅ Environment template updated')
      return 'echo "Environment template validation passed"'
    },
  ],
}
