#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🔒 Running security validations...')

// Check for common security issues
const securityChecks = [
  {
    name: 'Environment files',
    check: () => {
      const envFiles = ['.env', '.env.local', '.env.production', '.env.development']
      const foundFiles = []

      envFiles.forEach((file) => {
        if (fs.existsSync(file)) {
          foundFiles.push(file)
        }
      })

      if (foundFiles.length > 0) {
        console.warn(`⚠️  Found environment files: ${foundFiles.join(', ')}`)
        console.warn('   Ensure they are in .gitignore and not committed')
      }
    },
  },
  {
    name: 'Hardcoded secrets detection',
    check: () => {
      try {
        // Check staged files for potential secrets
        const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' }).trim()

        if (stagedFiles) {
          const secretPatterns = [
            'password\\s*=',
            'secret\\s*=',
            'key\\s*=',
            'token\\s*=',
            'api_key',
            'apikey',
            'access_token',
            'private_key',
          ]

          const pattern = secretPatterns.join('|')
          const command = `echo "${stagedFiles}" | xargs grep -l -i "${pattern}" || true`

          try {
            const result = execSync(command, { encoding: 'utf8' }).trim()
            if (result) {
              console.warn('⚠️  Potential secrets detected in files:', result)
              console.warn('   Please review these files before committing')
            }
          } catch (e) {
            // No secrets found - this is good
          }
        }
      } catch (e) {
        console.log('   No staged files to check')
      }
    },
  },
  {
    name: 'Package vulnerabilities',
    check: () => {
      try {
        console.log('   Checking for package vulnerabilities...')
        execSync('npm audit --audit-level=moderate', { stdio: 'pipe' })
        console.log('   ✅ No moderate or high severity vulnerabilities found')
      } catch (e) {
        console.warn('   ⚠️  Package vulnerabilities found')
        console.warn('   Run "npm audit" for details')
        console.warn('   Run "npm audit fix" to attempt automatic fixes')
        // Don't exit here for pre-commit, just warn
      }
    },
  },
  {
    name: 'Git hooks validation',
    check: () => {
      const hooksDir = '.husky'
      if (fs.existsSync(hooksDir)) {
        const hooks = fs.readdirSync(hooksDir).filter((file) => !file.startsWith('.') && !file.startsWith('_'))

        hooks.forEach((hook) => {
          const hookPath = path.join(hooksDir, hook)
          const stats = fs.statSync(hookPath)

          if (!(stats.mode & parseInt('100', 8))) {
            console.warn(`⚠️  Hook ${hook} is not executable`)
            console.warn(`   Run: chmod +x ${hookPath}`)
          }
        })
      }
    },
  },
]

// Run all security checks
let hasWarnings = false

securityChecks.forEach((check) => {
  try {
    console.log(`Checking: ${check.name}`)
    check.check()
  } catch (error) {
    console.error(`❌ Error in ${check.name}:`, error.message)
    hasWarnings = true
  }
})

if (hasWarnings) {
  console.log('\n⚠️  Security scan completed with warnings')
  console.log('Please review the warnings above')
} else {
  console.log('\n✅ Security validations completed successfully')
}

// For pre-commit hooks, we typically want to warn but not block
// For CI/CD, you might want to exit with error code
process.exit(0)
