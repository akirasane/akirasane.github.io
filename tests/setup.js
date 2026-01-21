// Test setup file for Vitest
// This file runs before all tests

// Setup DOM environment
import { beforeEach, afterEach } from 'vitest';

// Clean up DOM between tests
beforeEach(() => {
  document.body.innerHTML = '';
  document.head.innerHTML = '';
});

afterEach(() => {
  // Clean up any event listeners or timers
  document.body.innerHTML = '';
});

// Mock localStorage for tests
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

global.localStorage = localStorageMock;

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);
