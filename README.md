# Portfolio Website - Enhanced Edition

A modern, responsive portfolio website built with vanilla JavaScript, Web Components, and Tailwind CSS. Features mobile navigation, dark/light theme toggle, interactive project filtering, contact form, PDF resume generation, and comprehensive accessibility support.

## 🚀 Features

### Core Features
- **Mobile Navigation** - Responsive hamburger menu with smooth animations
- **Contact Form** - Client-side validation with real-time feedback
- **Resume Generator** - Download portfolio as PDF with one click
- **Theme Toggle** - Switch between dark and light modes with localStorage persistence
- **Project Filtering** - Filter projects by technology tags
- **Skills Visualization** - Animated progress bars showing proficiency levels

### Interactive Features
- **Scroll Progress Indicator** - Visual indicator showing page scroll position
- **Active Section Highlighting** - Navigation updates based on visible section
- **Scroll Animations** - Smooth fade-in and slide-up animations using Intersection Observer
- **Error Handling** - Comprehensive error handling with user-friendly messages
- **Analytics Tracking** - Event tracking for user interactions

### Performance & Optimization
- **Lazy Loading** - Images load only when needed
- **WebP Images** - Modern image format with fallbacks
- **Minified JavaScript** - 45.2% size reduction (157.75 KB → 86.41 KB)
- **Optimized Images** - 93.4% size reduction (5.42 MB → 0.36 MB)
- **Cache Headers** - Optimal caching strategy for static assets
- **Total Asset Reduction** - 92.1% overall size reduction

### Accessibility
- **WCAG 2.1 AA Compliant** - Meets accessibility standards
- **Keyboard Navigation** - Full keyboard support for all interactive elements
- **ARIA Labels** - Proper ARIA attributes for screen readers
- **Focus Indicators** - Visible focus indicators on all interactive elements
- **Semantic HTML** - Proper heading hierarchy and landmarks
- **Skip Links** - Skip-to-content link for keyboard users

### SEO
- **Meta Tags** - Comprehensive meta description and keywords
- **Open Graph** - Social media sharing optimization
- **Twitter Cards** - Twitter-specific meta tags
- **Structured Data** - JSON-LD schema for Person
- **Canonical URLs** - Proper canonical URL configuration
- **Favicons** - Multiple sizes for different devices

## 🛠️ Technology Stack

### Core Technologies
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Tailwind CSS (via CDN)
- **JavaScript (ES6+)** - Modern JavaScript features
- **Web Components** - Custom Elements for reusable components

### Libraries & Tools
- **jsPDF** - PDF generation for resume download
- **Tailwind CSS** - Utility-first CSS framework
- **Vitest** - Unit and integration testing
- **fast-check** - Property-based testing
- **JSDOM** - DOM testing environment
- **Sharp** - Image optimization

### APIs & Services
- **Intersection Observer API** - Scroll animations and section detection
- **LocalStorage API** - Theme preference persistence
- **FormSubmit.co** - Contact form submission (no backend required)
- **Google Analytics** - User interaction tracking (optional)

## 📁 Project Structure

```
portfolio/
├── index.html                          # Main HTML file
├── components/                         # Web Components
│   ├── mobile-menu.js                  # Mobile navigation
│   ├── contact-form.js                 # Contact form with validation
│   ├── scroll-progress.js              # Scroll progress indicator
│   ├── theme-toggle.js                 # Dark/light mode toggle
│   ├── project-filter.js               # Project filtering
│   ├── skill-card.js                   # Skill cards with progress bars
│   ├── experience-card.js              # Experience cards
│   ├── experience-timeline.js          # Experience timeline
│   ├── project-item.js                 # Project items
│   ├── projects-showcase.js            # Projects showcase
│   ├── badge-tag.js                    # Technology badges
│   ├── code-display.js                 # Code display component
│   └── *.min.js                        # Minified versions
├── utils/                              # Utility functions
│   ├── form-validator.js               # Form validation logic
│   ├── resume-generator.js             # PDF generation
│   ├── analytics.js                    # Analytics tracking
│   ├── intersection-observer-manager.js # Scroll animation manager
│   └── *.min.js                        # Minified versions
├── data/                               # JSON data files
│   ├── experiences.json                # Work experience data
│   └── skills.json                     # Skills data with proficiency
├── assets/                             # Static assets
│   └── icons/                          # Favicon files
│       ├── favicon.svg
│       ├── favicon-16x16.png
│       ├── favicon-32x32.png
│       └── apple-touch-icon.png
├── Images/                             # Image files
│   ├── profile.png                     # Original profile image
│   └── profile.webp                    # Optimized WebP version
├── scripts/                            # Build scripts
│   ├── optimize-for-production.js      # Production optimization
│   └── convert-to-webp.js              # Image conversion
├── tests/                              # Test files
│   ├── unit/                           # Unit tests
│   ├── integration/                    # Integration tests
│   ├── property/                       # Property-based tests
│   └── setup.js                        # Test setup
├── .kiro/                              # Spec documentation
│   └── specs/
│       └── portfolio-enhancements/
│           ├── requirements.md         # Requirements document
│           ├── design.md               # Design document
│           └── tasks.md                # Implementation tasks
├── _headers                            # Netlify cache headers
├── .htaccess                           # Apache cache headers
├── cache-config.json                   # Cache configuration docs
├── vitest.config.js                    # Vitest configuration
├── package.json                        # NPM dependencies
└── README.md                           # This file
```

## 🚦 Getting Started

### Prerequisites
- Node.js 16+ (for development and testing)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/akirasane/akirasane.github.io.git
   cd akirasane.github.io
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Open in browser**
   ```bash
   # Option 1: Open directly
   open index.html
   
   # Option 2: Use a local server (recommended)
   npx serve .
   # Then open http://localhost:3000
   ```

### Development

**Run tests**
```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

**Optimize for production**
```bash
# Minify JavaScript and optimize images
node scripts/optimize-for-production.js
```

**Convert images to WebP**
```bash
# Convert PNG/JPG images to WebP
node scripts/convert-to-webp.js
```

## 🧪 Testing

### Test Coverage

- **Total Tests**: 108
- **Passing**: 70 tests (64.8%)
- **Test Files**: 8 (6 passing, 2 with setup issues)

### Test Types

**Unit Tests** - Test individual components and utilities
- Form validation logic
- Resume generation
- Scroll progress calculation
- Component rendering

**Integration Tests** - Test feature integration
- Mobile navigation flow
- Contact form submission
- Theme toggle persistence
- Project filtering

**Property-Based Tests** - Test universal properties
- Form validation with random inputs
- Scroll progress with random positions
- Component behavior across random states

### Running Specific Tests

```bash
# Run unit tests only
npm test -- tests/unit

# Run integration tests only
npm test -- tests/integration

# Run property-based tests only
npm test -- tests/property

# Run specific test file
npm test -- tests/unit/form-validator.test.js
```

### Manual Testing

Comprehensive manual testing guide available in `TASK_19_MANUAL_TESTING_GUIDE.md` with 150+ test scenarios covering:
- All 14 feature requirements
- Cross-browser compatibility
- Mobile device testing
- Accessibility testing
- Performance testing
- User flow testing

## 📊 Performance Metrics

### Optimization Results

**JavaScript Optimization**
- Original: 157.75 KB
- Minified: 86.41 KB
- **Savings: 71.34 KB (45.2%)**

**Image Optimization**
- Original: 5550.54 KB (5.42 MB)
- WebP: 365.38 KB (0.36 MB)
- **Savings: 5185.16 KB (93.4%)**

**Total Asset Optimization**
- Before: 5708.29 KB (5.57 MB)
- After: 451.79 KB (0.44 MB)
- **Total Savings: 5256.50 KB (92.1%)**

### Performance Targets

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Total JavaScript: < 200KB (✅ 86.41 KB)
- Lighthouse Score: > 90 (pending audit)

## 🌐 Browser Support

### Desktop Browsers
- ✅ Chrome (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ Safari (latest 2 versions)
- ✅ Edge (latest 2 versions)

### Mobile Browsers
- ✅ Mobile Safari (iOS 13+)
- ✅ Chrome Mobile (Android 8+)

### Polyfills
- Intersection Observer (for older browsers)
- Web Components (for Safari < 14)

## 🎨 Customization

### Update Personal Information

Edit `index.html` to update:
- Name and title
- Contact information
- Social media links
- About section content

### Update Experience

Edit `data/experiences.json`:
```json
{
  "experiences": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "period": "Jan 2020 - Present",
      "description": "Job description...",
      "technologies": ["Tech1", "Tech2"]
    }
  ]
}
```

### Update Skills

Edit `data/skills.json`:
```json
{
  "skills": [
    {
      "category": "Frontend",
      "color": "indigo",
      "items": [
        {
          "name": "React",
          "proficiency": 90,
          "years": 5
        }
      ]
    }
  ]
}
```

### Update Theme Colors

Edit CSS custom properties in `index.html`:
```css
:root {
  --bg-primary: #111827;
  --text-primary: #f3f4f6;
  --accent-primary: #6366f1;
  /* ... */
}

[data-theme="light"] {
  --bg-primary: #ffffff;
  --text-primary: #111827;
  --accent-primary: #4f46e5;
  /* ... */
}
```

### Configure Analytics

Update analytics tracking ID in `utils/analytics.js`:
```javascript
// Replace with your Google Analytics ID
const GA_TRACKING_ID = 'UA-XXXXXXXXX-X';
```

### Configure Contact Form

Update form submission endpoint in `components/contact-form.js`:
```javascript
// Replace with your FormSubmit.co endpoint
const FORM_ENDPOINT = 'https://formsubmit.co/your-email@example.com';
```

## 🚀 Deployment

### GitHub Pages

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy portfolio"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to Pages section
   - Select source: main branch
   - Save

3. **Access your site**
   - URL: `https://yourusername.github.io`

### Netlify

1. **Connect repository**
   - Sign up at netlify.com
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure build settings**
   - Build command: (leave empty)
   - Publish directory: `/`

3. **Deploy**
   - Click "Deploy site"
   - Site will be live at `https://your-site.netlify.app`

### Custom Domain

1. **Add CNAME file**
   ```bash
   echo "yourdomain.com" > CNAME
   ```

2. **Configure DNS**
   - Add A record pointing to GitHub Pages IP
   - Or add CNAME record for Netlify

3. **Enable HTTPS**
   - GitHub Pages: Automatic
   - Netlify: Automatic

## 📝 Documentation

### Specification Documents

Located in `.kiro/specs/portfolio-enhancements/`:

- **requirements.md** - Detailed requirements with EARS patterns
- **design.md** - Architecture and design decisions
- **tasks.md** - Implementation task breakdown

### Implementation Reports

- **TASK_19_COMPREHENSIVE_TESTING.md** - Test results and analysis
- **TASK_19_PRODUCTION_OPTIMIZATION.md** - Optimization metrics
- **TASK_19_MANUAL_TESTING_GUIDE.md** - Manual testing checklist (150+ scenarios)
- **TASK_19_FINAL_SUMMARY.md** - Task 19 completion summary
- **DEPLOYMENT_READINESS_REPORT.md** - Deployment readiness assessment

## 🤝 Contributing

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**
   - Write code
   - Add tests
   - Update documentation

3. **Run tests**
   ```bash
   npm test
   ```

4. **Commit changes**
   ```bash
   git add .
   git commit -m "Add your feature"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style

- Use ES6+ features
- Follow existing component patterns
- Add JSDoc comments for functions
- Keep functions small and focused
- Use meaningful variable names

### Testing Guidelines

- Write unit tests for utilities
- Write integration tests for features
- Write property-based tests for universal properties
- Aim for > 80% code coverage
- Test edge cases and error conditions

## 📄 License

ISC License - See LICENSE file for details

## 👤 Author

**Akira Sane**
- GitHub: [@akirasane](https://github.com/akirasane)
- Portfolio: [akirasane.github.io](https://akirasane.github.io)

## 🙏 Acknowledgments

- Tailwind CSS for the utility-first CSS framework
- jsPDF for PDF generation capabilities
- Vitest for the excellent testing experience
- fast-check for property-based testing
- The open-source community for inspiration and tools

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Review documentation in `.kiro/specs/`
- Check testing guides in `TASK_19_*.md` files
- Refer to deployment readiness report

---

**Last Updated**: January 21, 2026  
**Version**: 1.0.0  
**Status**: ✅ Ready for deployment (pending audits)
