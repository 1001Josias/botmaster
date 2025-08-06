# 🚀 Pre-commit Hooks Setup Guide

This document describes how to configure and use the pre-commit hooks system implemented in the BotMaster monorepo.

## 📋 Implementation Summary

✅ **System successfully implemented!**

- ✅ Global Husky configuration
- ✅ Lint-staged with automatic workspace detection
- ✅ Validation scripts (security, types, bundle)
- ✅ Turborepo integration
- ✅ Configured hooks (pre-commit, commit-msg, pre-push)
- ✅ Migration of existing configurations

## 🛠️ Initial Setup

### 1. Install Dependencies

```bash
# In the project root directory
pnpm install
```

### 2. Initialize Git Hooks

```bash
# Already configured automatically by the prepare script
# But can be run manually if needed
npx husky init
```

## 🔧 How It Works

### Pre-commit Hook

Runs automatically before each commit:

1. **File-based validations** (via lint-staged):
   - ESLint + Prettier for JS/TS
   - Prettier for JSON/YAML/MD
   - Security audit for package.json
   - Sensitive files detection

2. **Workspace-specific validations**:
   - TypeScript type checking
   - Unit tests (when applicable)

### Commit-msg Hook

Validates commit messages using Conventional Commits:

```
feat: add new feature
fix: resolve bug in component
docs: update README
style: format code
refactor: improve performance
test: add unit tests
chore: update dependencies
```

### Pre-push Hook

Runs heavier validations before push:

1. **Complete security scan**
2. **Bundle size analysis**
3. **Integration tests** (future implementation)

## 📝 Available Commands

### Global Commands (at root)

```bash
# Run all lints
pnpm run lint:all

# Run all tests
pnpm run test

# Run type checking on all workspaces
pnpm run type-check:all

# Run security scan
pnpm run security:scan

# Run bundle analysis
pnpm run bundle:analyze

# Format all files
pnpm run format:all
```

### Per-Workspace Commands

```bash
# Inside any workspace (apps/web, apps/api, etc.)
pnpm run type-check       # Local type checking
pnpm run security:scan    # Local security scan
pnpm run bundle:analyze   # Local bundle analysis
```

## 🎯 Development Workflow

### 1. Developing code

```bash
# Normal development
git add .
git commit -m "feat: implement new feature"
```

**What happens:**

1. Pre-commit runs lint-staged
2. Files are automatically formatted
3. Quality validations are executed
4. Commit is created if everything passes

### 2. Pushing changes

```bash
git push origin feature-branch
```

**What happens:**

1. Pre-push executes heavy validations
2. Complete security scan
3. Bundle size analysis
4. Push is performed if everything passes

## ⚠️ Troubleshooting

### Error: "command not found"

```bash
# Reinstall dependencies
pnpm install
```

### Error: Type checking failed

```bash
# Run type check manually
pnpm run type-check:all

# In specific workspace
cd apps/web
pnpm run type-check
```

### Error: Lint failed

```bash
# Auto-fix issues
pnpm run lint:all

# Format code
pnpm run format:all
```

### Error: Bundle size exceeded

1. Analyze current size: `pnpm run bundle:analyze`
2. Consider:
   - Code splitting
   - Tree shaking
   - Removing unused dependencies
   - Lazy loading

### Error: Security scan warnings

1. Run: `pnpm audit`
2. Fix vulnerabilities: `pnpm audit`
3. Review files flagged with potential secrets

## 🔧 Customization

### Adjust Bundle Limits

Edit `scripts/bundle-analyzer.js`:

```javascript
const BUNDLE_LIMITS = {
  'apps/web': {
    js: 500, // KB
    css: 100, // KB
    total: 600, // KB
  },
  // ... other workspaces
}
```

### Add New File Patterns

Edit `.lintstagedrc.js`:

```javascript
'*.{new,extension}': [
  'command-to-process'
]
```

### Modify Commitlint Scopes

Edit `commitlint.config.js`:

```javascript
rules: {
  'scope-enum': [2, 'always', [
    'web', 'api', 'docs', 'ui',
    'new-scope' // Add here
  ]]
}
```

## 📊 Monitoring and Metrics

### Execution Logs

The hooks generate detailed logs that can be used to:

- Identify performance bottlenecks
- Monitor code compliance
- Track security issues

### CI/CD Configuration

To integrate with CI/CD pipelines, use:

```yaml
# GitHub Actions example
- name: Run security scan
  run: pnpm run security:scan

- name: Run type check
  run: pnpm run type-check:all

- name: Analyze bundle
  run: pnpm run bundle:analyze
```

## 🎓 Best Practices

### For Developers

1. **Small and frequent commits**
2. **Descriptive messages following Conventional Commits**
3. **Resolve lint warnings immediately**
4. **Review security alerts**

### For Leads/Architects

1. **Monitor bundle size metrics**
2. **Review security reports regularly**
3. **Adjust limits as needed**
4. **Train team on practices**

### For DevOps

1. **Integrate hooks with CI/CD pipelines**
2. **Monitor execution logs**
3. **Configure alerts for violations**
4. **Keep dependencies updated**

## 🚨 Emergency Bypass

**⚠️ Use only in emergencies!**

```bash
# Skip pre-commit (not recommended)
git commit --no-verify -m "emergency fix"

# Skip pre-push (not recommended)
git push --no-verify
```

## 📞 Support

In case of issues:

1. Check this document
2. Run manual validations
3. Review error logs
4. Contact DevOps team

## 🔄 Updates

This system will be continuously evolved. Stay updated with:

- New dependency versions
- New validation patterns
- Performance improvements
- Team feedback

---

**✅ System implemented and working!**
_Last updated: January 2025_
