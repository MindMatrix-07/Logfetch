# 🤝 Contributing to LogFetch

Thank you for your interest in contributing to LogFetch! This guide will help you get started.

---

## Code of Conduct

- Be respectful of all contributors
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

---

## Getting Started

### 1. Fork Repository

1. Visit https://github.com/MindMatrix-07/Logfetch
2. Click "Fork" button (top-right)
3. You now have your own copy: `github.com/YOUR_USERNAME/Logfetch`

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/Logfetch.git
cd Logfetch
git remote add upstream https://github.com/MindMatrix-07/Logfetch.git
```

### 3. Create Feature Branch

```bash
# Create new branch from latest main
git fetch upstream
git checkout -b feature/your-feature-name upstream/main

# Branch naming conventions:
# feature/new-feature-name
# fix/bug-description
# docs/documentation-update
# refactor/cleanup-description
```

### 4. Set Up Development

```bash
npm install
npm run dev
# Make your changes
```

---

## Types of Contributions

### 🐛 Bug Fixes

**Before submitting**:
1. Verify bug exists in latest `main` branch
2. Check existing issues first (might be reported)
3. Document steps to reproduce
4. Test fix works locally

**Submit**:
```bash
git commit -m "fix: describe the bug being fixed"
git push origin feature/bug-fix
# Open PR with bug details
```

### ✨ Features

**Before starting**:
1. Open an issue to discuss (avoids wasted work)
2. Get feedback from maintainers
3. Check if someone else is working on it

**Submit**:
```bash
git commit -m "feat: describe new feature"
git push origin feature/new-feature
# Open PR with examples of usage
```

### 📚 Documentation

**Areas that need help**:
- Typo fixes in READMEs
- Adding examples to API docs
- Improving setup guide
- Adding troubleshooting tips

**Submit**:
```bash
git commit -m "docs: describe documentation update"
git push origin docs/update-name
# Open PR
```

### ♻️ Refactoring

**Keep in mind**:
- Don't mix refactoring with features
- Maintain backwards compatibility
- Update tests if applicable
- Document why code was reorganized

**Submit**:
```bash
git commit -m "refactor: describe code reorganization"
git push origin refactor/cleanup-name
```

---

## Development Workflow

### Project Structure

```
src/
  App.jsx ..................... Main component (~280 lines)
    - LogFetch UI
    - API integration
    - State management
    - Filtering logic
index.css ..................... Tailwind styles
main.jsx ...................... Entry point
```

### Code Style

**Indentation**: 2 spaces
**Quotes**: Single quotes for strings
**Semicolons**: Always use
**Variables**: camelCase

```javascript
// ✅ Good
const fetchLogs = async () => {
  const url = `${backendUrl}/api/logs`;
  const response = await axios.get(url);
  setLogs(response.data.logs || []);
};

// ❌ Bad
const fetch_logs = async () => {
  var url = `${backendUrl}/api/logs`
  var response = await axios.get(url)
  setLogs(response.data.logs)
}
```

### Component Best Practices

```jsx
// ✅ Good - Clear, documented
import React, { useState, useEffect } from 'react';

export default function LogFetch() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch logs on component mount
  useEffect(() => {
    fetchLogs();
  }, []);

  // Fetch from backend API
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/logs`);
      setLogs(response.data.logs || []);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {loading && <p>Loading...</p>}
      {logs.map(log => <LogItem key={log.id} log={log} />)}
    </div>
  );
}
```

### Comments

Write comments for **why**, not **what**:

```jsx
// ✅ Good - Explains reasoning
// Refresh every 5 seconds to catch logs in real-time
// without overwhelming the backend with requests
const REFRESH_INTERVAL = 5000;

// ❌ Bad - States the obvious
// Set refresh interval to 5000 milliseconds
const REFRESH_INTERVAL = 5000;
```

---

## Testing Changes

### Manual Testing

```bash
# Start dev server
npm run dev

# Test in browser:
# 1. Navigate to http://localhost:3000
# 2. Enter backend URL in Settings
# 3. Verify logs load
# 4. Test filters
# 5. Click logs to expand
```

### Checklist

- [ ] App loads without console errors
- [ ] Can connect to backend
- [ ] Logs display with correct formatting
- [ ] Filters work correctly
- [ ] Settings panel updates backend URL
- [ ] Auto-refresh works (live/paused toggle)
- [ ] Summary stats accurate
- [ ] Mobile responsive (resize browser)
- [ ] Dark theme renders correctly

### Browser Testing

Test in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

---

## Committing Code

### Commit Messages

Follow conventional commits:

```
feat: add new feature
fix: resolve bug
docs: update documentation
refactor: reorganize code
test: add test case
style: code style changes
chore: build/dependency updates
```

**Examples**:
```bash
git commit -m "feat: add export logs to CSV"
git commit -m "fix: prevent logs from jumping on refresh"
git commit -m "docs: add API examples for Python"
git commit -m "refactor: extract log filtering to helper function"
```

### Atomic Commits

Keep commits small and focused:

```bash
# ✅ Good - Each commit does one thing
git commit -m "feat: add filter by date range"
git commit -m "docs: update API docs with date filter"

# ❌ Bad - Commits multiple unrelated changes
git commit -m "added filters, updated docs, fixed style"
```

### Sign Commits (Optional but Recommended)

```bash
# Generate GPG key (one-time)
gpg --gen-key

# Sign commits
git commit -S -m "your message"

# Or configure to always sign
git config --global commit.gpgsign true
```

---

## Submitting Pull Request

### Before Submitting

```bash
# Update with latest upstream changes
git fetch upstream
git rebase upstream/main

# Verify code style
npm run lint

# Test all changes work
npm run dev
```

### Create Pull Request

1. Push your branch: `git push origin feature/your-feature`
2. Go to https://github.com/MindMatrix-07/Logfetch
3. Click "New Pull Request"
4. Select your branch
5. Fill out PR template

### PR Description Template

```markdown
## Description
Brief description of changes

## Related Issue
Fixes #123 (if applicable)

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
How did you test this?
- [ ] Manual testing on Chrome
- [ ] Tested with different backend URLs
- [ ] Tested on mobile responsive

## Checklist
- [ ] Code follows style guide
- [ ] No console errors
- [ ] Works offline if applicable
- [ ] Updated documentation
- [ ] Tested in latest browsers
```

---

## Code Review Process

### What to Expect

Maintainers will review:
- ✅ Code quality & style
- ✅ Performance impact
- ✅ Documentation
- ✅ Test coverage
- ✅ Browser compatibility

### Responding to Feedback

1. **Constructive criticism** — Thank reviewer, implement suggestions
2. **Questions** — Ask clarifying questions respectfully
3. **Disagreements** — Discuss politely, be open to compromise

### Making Changes

```bash
# After feedback, make changes
git add .
git commit -m "review: address feedback on PR"
git push origin feature/your-feature

# No need to force-push, maintainers can follow discussion
```

---

## Common Contributions

### Add Error Message

In `src/App.jsx`:
```jsx
const [error, setError] = useState(null);

try {
  const response = await axios.get(...);
} catch (error) {
  setError(error.message);
}

return (
  <>
    {error && <div className="bg-red-900 text-white p-4">{error}</div>}
    {/* rest of UI */}
  </>
);
```

### Add New Filter

```jsx
const [filters, setFilters] = useState({
  level: 'all',
  category: '',
  action: 'recent',
  customFilter: 'none' // New filter
});

const handleFilterChange = (type, value) => {
  setFilters(prev => ({ ...prev, [type]: value }));
};

// In return:
<select onChange={(e) => handleFilterChange('customFilter', e.target.value)}>
  <option value="none">All</option>
  <option value="option1">Option 1</option>
</select>
```

### Fix Style Bug

In `src/index.css`:
```css
/* Add or modify Tailwind directives */
@layer components {
  .log-item {
    @apply bg-dark-700 p-4 rounded border-l-4 border-dark-600;
  }
}
```

### Update Documentation

Edit relevant markdown file:
- `README.md` — Feature overview
- `SETUP.md` — Setup instructions
- `DEPLOYMENT.md` — Deployment guide
- `API.md` — API reference

---

## Getting Help

### Resources

- **Questions**: Open [Discussion](https://github.com/MindMatrix-07/Logfetch/discussions)
- **Issues**: See [GitHub Issues](https://github.com/MindMatrix-07/Logfetch/issues)
- **Live-TV Docs**: [Live-TV Repo](https://github.com/MindMatrix-07/Live-TV)

### Stuck?

1. Check existing issues/PRs (might be solved)
2. Read troubleshooting in README
3. Ask in GitHub Discussions
4. Contact maintainers

---

## Contributor Recognition

Contributors will be recognized in:
- GitHub contributor graph
- Release notes
- Hall of fame (for major contributions)

---

## License

By contributing, you agree your code will be under MIT License (same as project).

---

## Questions?

- 💬 **Questions about contribution?** Open a Discussion
- 🐛 **Found a bug?** Open an Issue
- ✨ **Feature idea?** Open an Issue with label "enhancement"
- 📚 **Documentation fix?** Submit PR directly

---

**Thank you for contributing to LogFetch!** 🙏

Your help makes monitoring easier for everyone. 🚀
