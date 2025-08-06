#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('📦 Running bundle analysis...')

// Configuration for bundle size limits (in KB)
const BUNDLE_LIMITS = {
  // Main apps
  'apps/web': {
    js: 500,
    css: 100,
    total: 600,
  },
  'apps/docs': {
    js: 300,
    css: 80,
    total: 380,
  },
  'apps/jobmaster-gui': {
    js: 400,
    css: 120,
    total: 520,
  },
  // Packages
  'packages/ui': {
    js: 200,
    css: 150,
    total: 350,
  },
}

// Helper functions
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath)
    return Math.round(stats.size / 1024) // Convert to KB
  } catch {
    return 0
  }
}

function findFiles(dir, extensions) {
  if (!fs.existsSync(dir)) return []

  const files = []
  const items = fs.readdirSync(dir, { withFileTypes: true })

  for (const item of items) {
    const fullPath = path.join(dir, item.name)

    if (item.isDirectory()) {
      files.push(...findFiles(fullPath, extensions))
    } else if (extensions.some((ext) => item.name.endsWith(ext))) {
      files.push(fullPath)
    }
  }

  return files
}

function analyzeBundleSize(workspace) {
  const limits = BUNDLE_LIMITS[workspace]
  if (!limits) {
    console.log(`   No bundle limits configured for ${workspace}`)
    return { passed: true, warnings: [] }
  }

  const distPath = path.join(workspace, 'dist')
  const buildPath = path.join(workspace, 'build')
  const outPath = path.join(workspace, 'out')

  // Look for common build output directories
  let buildDir = null
  if (fs.existsSync(distPath)) buildDir = distPath
  else if (fs.existsSync(buildPath)) buildDir = buildPath
  else if (fs.existsSync(outPath)) buildDir = outPath

  if (!buildDir) {
    console.log(`   No build output found for ${workspace}`)
    return { passed: true, warnings: [`No build output to analyze for ${workspace}`] }
  }

  // Find JS and CSS files
  const jsFiles = findFiles(buildDir, ['.js', '.mjs'])
  const cssFiles = findFiles(buildDir, ['.css'])

  // Calculate sizes
  const jsSize = jsFiles.reduce((total, file) => total + getFileSize(file), 0)
  const cssSize = cssFiles.reduce((total, file) => total + getFileSize(file), 0)
  const totalSize = jsSize + cssSize

  const warnings = []
  let passed = true

  console.log(`   JS: ${jsSize}KB (limit: ${limits.js}KB)`)
  console.log(`   CSS: ${cssSize}KB (limit: ${limits.css}KB)`)
  console.log(`   Total: ${totalSize}KB (limit: ${limits.total}KB)`)

  if (jsSize > limits.js) {
    warnings.push(`JS bundle size ${jsSize}KB exceeds limit ${limits.js}KB`)
    passed = false
  }

  if (cssSize > limits.css) {
    warnings.push(`CSS bundle size ${cssSize}KB exceeds limit ${limits.css}KB`)
    passed = false
  }

  if (totalSize > limits.total) {
    warnings.push(`Total bundle size ${totalSize}KB exceeds limit ${limits.total}KB`)
    passed = false
  }

  return { passed, warnings, sizes: { js: jsSize, css: cssSize, total: totalSize } }
}

function checkDependencyUpdates() {
  try {
    console.log('   Checking for outdated dependencies...')
    const result = execSync('pnpm outdated --json', { encoding: 'utf8', stdio: 'pipe' })

    if (result.trim()) {
      const outdated = JSON.parse(result)
      const count = Object.keys(outdated).length

      if (count > 0) {
        console.warn(`   ⚠️  ${count} outdated dependencies found`)
        console.warn('   Run "pnpm outdated" for details')
        return [`${count} outdated dependencies`]
      }
    }
  } catch (e) {
    // npm outdated returns exit code 1 when outdated packages exist
    // We handle this gracefully
  }

  return []
}

function analyzeDuplicateDependencies() {
  try {
    console.log('   Checking for duplicate dependencies...')
    const result = execSync('pnpm ls --depth=0 --json', { encoding: 'utf8', stdio: 'pipe' })
    const packageData = JSON.parse(result)

    // This is a simplified check - in practice you might want more sophisticated analysis
    const warnings = []

    if (packageData.problems && packageData.problems.length > 0) {
      warnings.push(`${packageData.problems.length} dependency issues found`)
    }

    return warnings
  } catch (e) {
    return ['Could not analyze dependencies']
  }
}

// Main analysis
async function runAnalysis() {
  const allWarnings = []
  let allPassed = true

  // Check each configured workspace
  for (const workspace of Object.keys(BUNDLE_LIMITS)) {
    if (fs.existsSync(workspace)) {
      console.log(`\nAnalyzing ${workspace}:`)
      const result = analyzeBundleSize(workspace)

      if (!result.passed) {
        allPassed = false
        allWarnings.push(...result.warnings)
      }

      if (result.warnings) {
        allWarnings.push(...result.warnings)
      }
    } else {
      console.log(`\nSkipping ${workspace} (not found)`)
    }
  }

  // Additional checks
  console.log('\nRunning additional checks:')

  const depWarnings = checkDependencyUpdates()
  allWarnings.push(...depWarnings)

  const duplicateWarnings = analyzeDuplicateDependencies()
  allWarnings.push(...duplicateWarnings)

  // Summary
  console.log('\n📊 Bundle Analysis Summary:')

  if (allWarnings.length > 0) {
    console.log('⚠️  Warnings found:')
    allWarnings.forEach((warning) => console.log(`   - ${warning}`))

    if (!allPassed) {
      console.log('\n❌ Bundle size limits exceeded!')
      console.log('Consider:')
      console.log('   - Code splitting')
      console.log('   - Tree shaking optimization')
      console.log('   - Removing unused dependencies')
      console.log('   - Using dynamic imports')
    }
  } else {
    console.log('✅ All checks passed!')
  }

  // For pre-commit, we warn but don't block on bundle size
  // For CI/CD, you might want stricter enforcement
  return allPassed
}

// Run the analysis
runAnalysis()
  .then((passed) => {
    if (passed && allWarnings.length === 0) {
      console.log('\n✅ Bundle analysis completed successfully')
    } else {
      console.log('\n⚠️  Bundle analysis completed with warnings')
    }
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Bundle analysis failed:', error.message)
    process.exit(0) // Don't block pre-commit on analysis errors
  })
