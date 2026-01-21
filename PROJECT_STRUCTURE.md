# Project Structure

Clean, organized structure for the portfolio website project.

## 📁 Root Directory Structure

```
akirasane.github.io/
├── index.html                  # Main portfolio page
├── README.md                   # Project documentation
├── PROJECT_STRUCTURE.md        # This file
├── package.json                # NPM dependencies
├── vitest.config.js            # Test configuration
├── _headers                    # Netlify cache headers
├── .htaccess                   # Apache cache headers
├── cache-config.json           # Cache configuration docs
│
├── components/                 # Web Components
│   ├── *.js                    # Source files
│   └── *.min.js                # Minified production files
│
├── utils/                      # Utility functions
│   ├── *.js                    # Source files
│   └── *.min.js                # Minified production files
│
├── data/                       # JSON data files
│   ├── experiences.json        # Work experience
│   └── skills.json             # Skills with proficiency
│
├── assets/                     # Static assets
│   └── icons/                  # Favicon files
│
├── Images/                     # Image files
│   ├── *.png                   # Original images
│   └── *.webp                  # Optimized WebP images
│
├── scripts/                    # Build scripts
│   ├── optimize-for-production.js
│   └── convert-to-webp.js
│
├── tests/                      # Test files
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   ├── property/               # Property-based tests
│   └── setup.js                # Test setup
│
├── test-pages/                 # Manual test pages (not deployed)
│   └── test-*.html             # Various test pages
│
├── docs/                       # Documentation
│   ├── README.md               # Documentation index
│   ├── tasks/                  # Task implementation docs
│   ├── checkpoints/            # Checkpoint verification
│   └── deployment/             # Deployment guides
│
├── .kiro/                      # Kiro spec files
│   └── specs/
│       └── portfolio-enhancements/
│           ├── requirements.md
│           ├── design.md
│           └── tasks.md
│
└── node_modules/               # NPM dependencies (not deployed)
```

## 📦 Production Files (Deploy These)

### Essential Files
- ✅ `index.html` - Main page
- ✅ `README.md` - Documentation
- ✅ `_headers` - Cache headers (Netlify)
- ✅ `.htaccess` - Cache headers (Apache)

### Components (Use .min.js versions)
- ✅ `components/*.min.js` - Minified components
- ✅ `utils/*.min.js` - Minified utilities

### Data Files
- ✅ `data/experiences.json`
- ✅ `data/skills.json`

### Assets
- ✅ `assets/icons/*` - All favicon files
- ✅ `Images/*.webp` - Optimized images
- ✅ `Images/*.png` - Fallback images

## 🚫 Files to Exclude from Deployment

### Development Files
- ❌ `node_modules/` - NPM dependencies
- ❌ `package.json` - NPM config
- ❌ `package-lock.json` - NPM lock file
- ❌ `vitest.config.js` - Test config

### Documentation (Optional)
- ⚠️ `docs/` - Keep if you want docs accessible
- ⚠️ `.kiro/` - Spec files (usually exclude)
- ⚠️ `PROJECT_STRUCTURE.md` - This file (optional)

### Test Files
- ❌ `tests/` - Test files
- ❌ `test-pages/` - Manual test pages

### Source Files (if using minified)
- ⚠️ `components/*.js` (non-minified) - Keep for development
- ⚠️ `utils/*.js` (non-minified) - Keep for development

### Build Scripts
- ❌ `scripts/` - Build scripts (not needed in production)

## 🎯 Deployment Configurations

### GitHub Pages
Create `.gitignore` to exclude:
```
node_modules/
test-pages/
.vscode/
*.log
```

### Netlify
Create `netlify.toml`:
```toml
[build]
  publish = "."
  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Apache
Already configured with `.htaccess` for cache headers.

## 📊 File Size Summary

### Production Assets (Minified)
- **JavaScript**: 86.41 KB (16 files)
- **Images**: 365.38 KB (WebP)
- **HTML/CSS**: ~50 KB
- **Data**: ~10 KB
- **Total**: ~512 KB

### Development Assets (Full)
- **JavaScript**: 157.75 KB (source files)
- **Images**: 5550.54 KB (PNG originals)
- **Tests**: ~100 KB
- **Docs**: ~500 KB
- **Total**: ~6.3 MB

## 🔧 Maintenance

### Regular Updates
1. **Content Updates**
   - Edit `data/experiences.json` for new jobs
   - Edit `data/skills.json` for new skills
   - Update `index.html` for personal info

2. **Code Updates**
   - Modify source `.js` files
   - Run `node scripts/optimize-for-production.js`
   - Test changes
   - Deploy minified files

3. **Image Updates**
   - Add new images to `Images/`
   - Run `node scripts/convert-to-webp.js`
   - Update `index.html` with picture elements

### Version Control
```bash
# Commit changes
git add .
git commit -m "Update: description"
git push origin main

# Tag releases
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

## 📖 Quick Navigation

### For Development
- **Source Code**: `components/`, `utils/`
- **Tests**: `tests/`
- **Test Pages**: `test-pages/`
- **Build Scripts**: `scripts/`

### For Documentation
- **Main Docs**: `README.md`
- **Spec Docs**: `.kiro/specs/portfolio-enhancements/`
- **Task Docs**: `docs/tasks/`
- **Deployment**: `docs/deployment/`

### For Production
- **Main Page**: `index.html`
- **Minified JS**: `components/*.min.js`, `utils/*.min.js`
- **Optimized Images**: `Images/*.webp`
- **Data**: `data/*.json`

## 🎨 Customization Guide

### Change Colors
Edit CSS custom properties in `index.html`:
```css
:root {
  --bg-primary: #111827;
  --accent-primary: #6366f1;
}
```

### Add New Component
1. Create `components/new-component.js`
2. Add tests in `tests/unit/new-component.test.js`
3. Run optimization script
4. Include in `index.html`

### Add New Feature
1. Update requirements in `.kiro/specs/`
2. Update design document
3. Add task to tasks.md
4. Implement feature
5. Add tests
6. Update documentation

## 🚀 Deployment Checklist

- [ ] Run `node scripts/optimize-for-production.js`
- [ ] Update `index.html` to use `.min.js` files
- [ ] Test all features work with minified files
- [ ] Run Lighthouse audit
- [ ] Run accessibility audit
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Push to repository
- [ ] Verify deployment successful

---

**Last Updated**: January 21, 2026  
**Project Version**: 1.0.0  
**Structure Version**: 1.0.0
