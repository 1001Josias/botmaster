#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🔍 Running TypeScript type checking...')

// Find all workspaces with TypeScript configuration
function findTypeScriptWorkspaces() {
  const workspaces = []
  const searchDirs = ['apps', 'packages']

  searchDirs.forEach((dir) => {
    if (!fs.existsSync(dir)) return

    const items = fs.readdirSync(dir, { withFileTypes: true })
    items.forEach((item) => {
      if (item.isDirectory()) {
        const workspacePath = path.join(dir, item.name)
        const tsconfigPath = path.join(workspacePath, 'tsconfig.json')

        if (fs.existsSync(tsconfigPath)) {
          workspaces.push({
            name: item.name,
            path: workspacePath,
            tsconfig: tsconfigPath,
          })
        }
      }
    })
  })

  return workspaces
}

// Check if workspace has TypeScript files
function hasTypeScriptFiles(workspacePath) {
  try {
    const result = execSync(`find ${workspacePath} -name "*.ts" -o -name "*.tsx" | head -1`, {
      encoding: 'utf8',
      stdio: 'pipe',
    })
    return result.trim().length > 0
  } catch {
    return false
  }
}

// Run type checking for a specific workspace
function runTypeCheck(workspace) {
  console.log(`\nChecking ${workspace.name}:`)

  if (!hasTypeScriptFiles(workspace.path)) {
    console.log('   No TypeScript files found, skipping')
    return { success: true, warnings: [] }
  }

  try {
    // Change to workspace directory and run tsc
    const command = `cd ${workspace.path} && npx tsc --noEmit --pretty`
    execSync(command, { stdio: 'inherit' })

    console.log(`   ✅ Type checking passed for ${workspace.name}`)
    return { success: true, warnings: [] }
  } catch (error) {
    console.error(`   ❌ Type checking failed for ${workspace.name}`)
    return {
      success: false,
      warnings: [`Type checking failed in ${workspace.name}`],
      error: error.message,
    }
  }
}

// Check for common TypeScript configuration issues
function validateTypeScriptConfig(workspace) {
  try {
    const tsconfigContent = fs.readFileSync(workspace.tsconfig, 'utf8')
    const tsconfig = JSON.parse(tsconfigContent)

    const warnings = []

    // Check for strict mode
    if (!tsconfig.compilerOptions?.strict) {
      warnings.push(`${workspace.name}: Consider enabling strict mode for better type safety`)
    }

    // Check for noUnusedLocals
    if (!tsconfig.compilerOptions?.noUnusedLocals) {
      warnings.push(`${workspace.name}: Consider enabling noUnusedLocals`)
    }

    // Check for noUnusedParameters
    if (!tsconfig.compilerOptions?.noUnusedParameters) {
      warnings.push(`${workspace.name}: Consider enabling noUnusedParameters`)
    }

    // Check for exactOptionalPropertyTypes (TS 4.4+)
    if (!tsconfig.compilerOptions?.exactOptionalPropertyTypes) {
      warnings.push(`${workspace.name}: Consider enabling exactOptionalPropertyTypes for stricter optional properties`)
    }

    return warnings
  } catch (error) {
    return [`${workspace.name}: Could not parse tsconfig.json`]
  }
}

// Main execution
async function runTypeChecking() {
  const workspaces = findTypeScriptWorkspaces()

  if (workspaces.length === 0) {
    console.log('No TypeScript workspaces found')
    return true
  }

  console.log(`Found ${workspaces.length} TypeScript workspace(s):`)
  workspaces.forEach((ws) => console.log(`  - ${ws.name}`))

  let allSuccess = true
  const allWarnings = []

  // Validate configurations first
  console.log('\n📋 Validating TypeScript configurations...')
  workspaces.forEach((workspace) => {
    const configWarnings = validateTypeScriptConfig(workspace)
    allWarnings.push(...configWarnings)
  })

  // Run type checking
  console.log('\n🔍 Running type checks...')

  for (const workspace of workspaces) {
    const result = runTypeCheck(workspace)

    if (!result.success) {
      allSuccess = false
    }

    if (result.warnings) {
      allWarnings.push(...result.warnings)
    }
  }

  // Summary
  console.log('\n📊 Type Checking Summary:')

  if (allWarnings.length > 0) {
    console.log('\n⚠️  Configuration recommendations:')
    allWarnings.forEach((warning) => {
      if (!warning.includes('failed')) {
        console.log(`   - ${warning}`)
      }
    })
  }

  if (!allSuccess) {
    console.log('\n❌ Type checking failed!')
    console.log('Please fix the TypeScript errors above before committing.')
    return false
  } else {
    console.log('\n✅ All type checks passed!')
    return true
  }
}

// Execute
runTypeChecking()
  .then((success) => {
    if (success) {
      console.log('\n✅ TypeScript validation completed successfully')
      process.exit(0)
    } else {
      console.log('\n❌ TypeScript validation failed')
      process.exit(1) // Fail pre-commit on type errors
    }
  })
  .catch((error) => {
    console.error('❌ Type checking process failed:', error.message)
    process.exit(1)
  })
