# Quick Reference Card

Fast access to common files and tasks.

## 📁 Where to Find Things

### Main Files
- **Portfolio Page**: `index.html`
- **Project Docs**: `README.md`
- **Structure Guide**: `PROJECT_STRUCTURE.md`

### Documentation
- **All Docs**: `docs/`
- **Doc Index**: `docs/README.md`
- **Task Reports**: `docs/tasks/`
- **Checkpoints**: `docs/checkpoints/`
- **Deployment**: `docs/deployment/`

### Code
- **Components**: `components/` (use `.min.js` for production)
- **Utilities**: `utils/` (use `.min.js` for production)
- **Data**: `data/experiences.json`, `data/skills.json`

### Testing
- **Test Files**: `tests/`
- **Test Pages**: `test-pages/`
- **Run Tests**: `npm test`

### Build
- **Optimize**: `node scripts/optimize-for-production.js`
- **Convert Images**: `node scripts/convert-to-webp.js`

## 🚀 Common Commands

### Development
```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

### Production
```bash
# Optimize for production
node scripts/optimize-for-production.js

# Convert images to WebP
node scripts/convert-to-webp.js
```

### Deployment
```bash
# Commit changes
git add .
git commit -m "Your message"
git push origin main
```

## 📊 Key Metrics

### Performance
- JavaScript: 86.41 KB (45.2% reduction)
- Images: 365.38 KB (93.4% reduction)
- Total: 451.79 KB (92.1% reduction)

### Testing
- Total Tests: 108
- Passing: 70 (64.8%)
- Test Files: 8

### Implementation
- Tasks: 19/19 (100%)
- Features: 14/14 (100%)
- Requirements: All met

## 🎯 Quick Tasks

### Update Content
1. Edit `data/experiences.json` for work history
2. Edit `data/skills.json` for skills
3. Edit `index.html` for personal info

### Add New Feature
1. Create component in `components/`
2. Add tests in `tests/unit/`
3. Run optimization script
4. Update `index.html`

### Deploy Changes
1. Run `node scripts/optimize-for-production.js`
2. Update `index.html` to use `.min.js` files
3. Test locally
4. Commit and push

## 📖 Documentation Quick Links

### Getting Started
- Setup: `README.md` → Getting Started
- Structure: `PROJECT_STRUCTURE.md`
- Organization: `FILE_ORGANIZATION_SUMMARY.md`

### Implementation
- Requirements: `.kiro/specs/portfolio-enhancements/requirements.md`
- Design: `.kiro/specs/portfolio-enhancements/design.md`
- Tasks: `.kiro/specs/portfolio-enhancements/tasks.md`

### Testing
- Test Guide: `docs/tasks/TASK_19_MANUAL_TESTING_GUIDE.md`
- Test Results: `docs/tasks/TASK_19_COMPREHENSIVE_TESTING.md`

### Deployment
- Readiness: `docs/deployment/DEPLOYMENT_READINESS_REPORT.md`
- Checklist: `docs/deployment/DEPLOYMENT_CHECKLIST.md`

## 🔧 Troubleshooting

### Tests Failing?
```bash
# Check test output
npm test

# Run specific test
npm test -- tests/unit/form-validator.test.js

# Check test setup
cat tests/setup.js
```

### Features Not Working?
1. Check browser console for errors
2. Verify `.min.js` files are up to date
3. Run optimization script again
4. Clear browser cache

### Deployment Issues?
1. Check `docs/deployment/DEPLOYMENT_CHECKLIST.md`
2. Verify all files are committed
3. Check deployment logs
4. Test in staging first

## 📞 Need Help?

### Documentation
- Main docs: `README.md`
- Doc index: `docs/README.md`
- Structure: `PROJECT_STRUCTURE.md`

### Specific Topics
- Testing: `docs/tasks/TASK_19_MANUAL_TESTING_GUIDE.md`
- Deployment: `docs/deployment/DEPLOYMENT_CHECKLIST.md`
- Optimization: `docs/tasks/TASK_19_PRODUCTION_OPTIMIZATION.md`

---

**Last Updated**: January 21, 2026  
**Quick Reference Version**: 1.0.0
