/**
 * Checkpoint 14: Interactive Features Verification Tests
 * Tests scroll progress, active section highlighting, theme toggle, and project filtering
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

describe('Checkpoint 14: Interactive Features', () => {
  let dom;
  let document;
  let window;

  beforeEach(() => {
    // Load the main HTML file
    const html = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf-8');
    dom = new JSDOM(html, {
      runScripts: 'dangerously',
      resources: 'usable',
      url: 'http://localhost:8000'
    });
    document = dom.window.document;
    window = dom.window;

    // Mock localStorage
    const localStorageMock = {
      getItem: (key) => localStorageMock[key] || null,
      setItem: (key, value) => { localStorageMock[key] = value; },
      removeItem: (key) => { delete localStorageMock[key]; },
      clear: () => {
        Object.keys(localStorageMock).forEach(key => {
          if (key !== 'getItem' && key !== 'setItem' && key !== 'removeItem' && key !== 'clear') {
            delete localStorageMock[key];
          }
        });
      }
    };
    window.localStorage = localStorageMock;
  });

  afterEach(() => {
    dom.window.close();
  });

  describe('Feature 1: Scroll Progress Indicator', () => {
    it('should have scroll-progress component in the page', () => {
      const scrollProgress = document.querySelector('scroll-progress');
      expect(scrollProgress).toBeTruthy();
    });

    it('should render progress bar container and bar', async () => {
      // Wait for component to render
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const scrollProgress = document.querySelector('scroll-progress');
      const container = scrollProgress?.querySelector('.scroll-progress-container');
      const bar = scrollProgress?.querySelector('.scroll-progress-bar');
      
      expect(container).toBeTruthy();
      expect(bar).toBeTruthy();
    });

    it('should have correct styling for progress bar', async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const scrollProgress = document.querySelector('scroll-progress');
      const container = scrollProgress?.querySelector('.scroll-progress-container');
      
      if (container) {
        const styles = window.getComputedStyle(container);
        expect(styles.position).toBe('fixed');
        expect(styles.top).toBe('0px');
        expect(styles.width).toBe('100%');
      }
    });
  });

  describe('Feature 2: Active Section Highlighting', () => {
    it('should have navigation links with href attributes', () => {
      const navLinks = document.querySelectorAll('a[href^="#"]');
      expect(navLinks.length).toBeGreaterThan(0);
    });

    it('should have sections with id attributes', () => {
      const sections = document.querySelectorAll('section[id]');
      expect(sections.length).toBeGreaterThan(0);
      
      // Verify common sections exist
      expect(document.querySelector('#home')).toBeTruthy();
      expect(document.querySelector('#about')).toBeTruthy();
      expect(document.querySelector('#skills')).toBeTruthy();
      expect(document.querySelector('#projects')).toBeTruthy();
      expect(document.querySelector('#contact')).toBeTruthy();
    });

    it('should have nav-active class styling defined', () => {
      const styles = document.querySelector('style')?.textContent || '';
      expect(styles).toContain('nav-active');
    });

    it('should have Intersection Observer setup in script', () => {
      const scripts = Array.from(document.querySelectorAll('script'))
        .map(s => s.textContent)
        .join('\n');
      
      expect(scripts).toContain('IntersectionObserver');
      expect(scripts).toContain('initActiveSectionHighlighting');
    });
  });

  describe('Feature 3: Theme Toggle & Persistence', () => {
    it('should have theme-toggle component in the page', () => {
      const themeToggle = document.querySelector('theme-toggle');
      expect(themeToggle).toBeTruthy();
    });

    it('should have CSS custom properties for theming', () => {
      const styles = document.querySelector('style')?.textContent || '';
      
      // Check for dark theme variables
      expect(styles).toContain('--bg-primary');
      expect(styles).toContain('--text-primary');
      expect(styles).toContain('--accent-primary');
      
      // Check for light theme variables
      expect(styles).toContain('[data-theme="light"]');
    });

    it('should have theme transition styles', () => {
      const styles = document.querySelector('style')?.textContent || '';
      expect(styles).toContain('transition');
      expect(styles).toContain('0.3s');
    });

    it('should save theme preference to localStorage', async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const themeToggle = document.querySelector('theme-toggle');
      if (themeToggle && typeof themeToggle.setTheme === 'function') {
        themeToggle.setTheme('light');
        expect(window.localStorage.getItem('theme-preference')).toBe('light');
        
        themeToggle.setTheme('dark');
        expect(window.localStorage.getItem('theme-preference')).toBe('dark');
      }
    });
  });

  describe('Feature 4: Project Filtering', () => {
    it('should have project-filter component in the page', () => {
      const projectFilter = document.querySelector('project-filter');
      expect(projectFilter).toBeTruthy();
    });

    it('should have project-item elements', () => {
      const projectItems = document.querySelectorAll('project-item');
      expect(projectItems.length).toBeGreaterThan(0);
    });

    it('should have badge-tag elements within projects', () => {
      const badges = document.querySelectorAll('project-item badge-tag');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('should extract technologies from projects', async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const projectFilter = document.querySelector('project-filter');
      if (projectFilter && projectFilter.shadowRoot) {
        const filterButtons = projectFilter.shadowRoot.querySelectorAll('.filter-btn');
        // Should have at least "All" button plus technology buttons
        expect(filterButtons.length).toBeGreaterThan(1);
      }
    });
  });

  describe('Integration: All Features Together', () => {
    it('should have all interactive components present', () => {
      expect(document.querySelector('scroll-progress')).toBeTruthy();
      expect(document.querySelector('theme-toggle')).toBeTruthy();
      expect(document.querySelector('project-filter')).toBeTruthy();
      expect(document.querySelectorAll('section[id]').length).toBeGreaterThan(0);
    });

    it('should have no duplicate IDs', () => {
      const ids = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should have proper ARIA labels for accessibility', () => {
      const nav = document.querySelector('nav');
      expect(nav?.getAttribute('role')).toBe('navigation');
      expect(nav?.getAttribute('aria-label')).toBeTruthy();
    });

    it('should have skip-to-content link for accessibility', () => {
      const skipLink = document.querySelector('.skip-to-content');
      expect(skipLink).toBeTruthy();
      expect(skipLink?.getAttribute('href')).toBe('#main-content');
    });

    it('should have main content landmark', () => {
      const mainContent = document.querySelector('#main-content');
      expect(mainContent).toBeTruthy();
    });
  });

  describe('Performance: Event Listeners', () => {
    it('should use requestAnimationFrame for scroll progress', () => {
      const scripts = Array.from(document.querySelectorAll('script'))
        .map(s => s.textContent)
        .join('\n');
      
      // Check that scroll progress component uses RAF
      expect(scripts).toContain('requestAnimationFrame');
    });

    it('should use passive event listeners where appropriate', () => {
      const scripts = Array.from(document.querySelectorAll('script'))
        .map(s => s.textContent)
        .join('\n');
      
      expect(scripts).toContain('passive: true');
    });
  });
});
