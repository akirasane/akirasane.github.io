/**
 * Unit tests for Scroll Progress Component
 * Tests specific examples and edge cases for scroll progress functionality
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

// Load the component code
const componentCode = fs.readFileSync(
  path.resolve(__dirname, '../../components/scroll-progress.js'),
  'utf-8'
);

describe('ScrollProgress Component', () => {
  let scrollProgress;

  beforeEach(() => {
    // Execute the component code to register the custom element
    eval(componentCode);
    
    // Create and append the component
    scrollProgress = document.createElement('scroll-progress');
    document.body.appendChild(scrollProgress);
  });

  afterEach(() => {
    // Clean up
    if (scrollProgress && scrollProgress.parentNode) {
      scrollProgress.parentNode.removeChild(scrollProgress);
    }
  });

  describe('Component Rendering', () => {
    it('should render progress bar container', () => {
      const container = scrollProgress.querySelector('.scroll-progress-container');
      expect(container).toBeTruthy();
    });

    it('should render progress bar element', () => {
      const bar = scrollProgress.querySelector('.scroll-progress-bar');
      expect(bar).toBeTruthy();
    });

    it('should have fixed position at top', () => {
      const container = scrollProgress.querySelector('.scroll-progress-container');
      const styles = window.getComputedStyle(container);
      expect(styles.position).toBe('fixed');
      expect(styles.top).toBe('0px');
    });

    it('should have gradient background', () => {
      const bar = scrollProgress.querySelector('.scroll-progress-bar');
      const styles = window.getComputedStyle(bar);
      expect(styles.background).toContain('linear-gradient');
    });
  });

  describe('Progress Calculation', () => {
    it('should return 0 when at top of page', () => {
      // Mock scroll position at top
      Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });
      Object.defineProperty(document.documentElement, 'scrollTop', { value: 0, writable: true });
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });

      const progress = scrollProgress.calculateProgress();
      expect(progress).toBe(0);
    });

    it('should return 100 when at bottom of page', () => {
      // Mock scroll position at bottom
      Object.defineProperty(window, 'pageYOffset', { value: 1000, writable: true });
      Object.defineProperty(document.documentElement, 'scrollTop', { value: 1000, writable: true });
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });

      const progress = scrollProgress.calculateProgress();
      expect(progress).toBe(100);
    });

    it('should return 50 when at middle of page', () => {
      // Mock scroll position at middle
      Object.defineProperty(window, 'pageYOffset', { value: 500, writable: true });
      Object.defineProperty(document.documentElement, 'scrollTop', { value: 500, writable: true });
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });

      const progress = scrollProgress.calculateProgress();
      expect(progress).toBe(50);
    });

    it('should return 0 when page is not scrollable', () => {
      // Mock non-scrollable page
      Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });
      Object.defineProperty(document.documentElement, 'scrollTop', { value: 0, writable: true });
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 1000, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });

      const progress = scrollProgress.calculateProgress();
      expect(progress).toBe(0);
    });

    it('should clamp progress between 0 and 100', () => {
      // Test that progress never exceeds bounds
      Object.defineProperty(window, 'pageYOffset', { value: 2000, writable: true });
      Object.defineProperty(document.documentElement, 'scrollTop', { value: 2000, writable: true });
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });

      const progress = scrollProgress.calculateProgress();
      expect(progress).toBeLessThanOrEqual(100);
      expect(progress).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Progress Property', () => {
    it('should expose progress getter', () => {
      expect(typeof scrollProgress.progress).toBe('number');
    });

    it('should return value between 0 and 100', () => {
      const progress = scrollProgress.progress;
      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThanOrEqual(100);
    });
  });

  describe('Progress Bar Update', () => {
    it('should update progress bar width', () => {
      // Mock scroll position
      Object.defineProperty(window, 'pageYOffset', { value: 500, writable: true });
      Object.defineProperty(document.documentElement, 'scrollTop', { value: 500, writable: true });
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });

      scrollProgress.updateProgress();
      
      const bar = scrollProgress.querySelector('.scroll-progress-bar');
      expect(bar.style.width).toBe('50%');
    });

    it('should set width to 0% at top', () => {
      Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });
      Object.defineProperty(document.documentElement, 'scrollTop', { value: 0, writable: true });
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });

      scrollProgress.updateProgress();
      
      const bar = scrollProgress.querySelector('.scroll-progress-bar');
      expect(bar.style.width).toBe('0%');
    });

    it('should set width to 100% at bottom', () => {
      Object.defineProperty(window, 'pageYOffset', { value: 1000, writable: true });
      Object.defineProperty(document.documentElement, 'scrollTop', { value: 1000, writable: true });
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });

      scrollProgress.updateProgress();
      
      const bar = scrollProgress.querySelector('.scroll-progress-bar');
      expect(bar.style.width).toBe('100%');
    });
  });

  describe('Event Handling', () => {
    it('should attach scroll event listener on connect', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      
      const newComponent = document.createElement('scroll-progress');
      newComponent.connectedCallback();
      
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function),
        expect.objectContaining({ passive: true })
      );
      
      addEventListenerSpy.mockRestore();
    });

    it('should remove scroll event listener on disconnect', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      
      scrollProgress.disconnectedCallback();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function)
      );
      
      removeEventListenerSpy.mockRestore();
    });

    it('should use requestAnimationFrame for scroll updates', () => {
      const rafSpy = vi.spyOn(window, 'requestAnimationFrame');
      
      scrollProgress.onScroll();
      
      expect(rafSpy).toHaveBeenCalled();
      
      rafSpy.mockRestore();
    });
  });
});
