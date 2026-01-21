import { describe, it, expect } from 'vitest';

describe('Sample Test Suite', () => {
  it('should verify test setup is working', () => {
    expect(true).toBe(true);
  });

  it('should have access to DOM', () => {
    const div = document.createElement('div');
    div.textContent = 'Hello World';
    expect(div.textContent).toBe('Hello World');
  });

  it('should have access to localStorage', () => {
    localStorage.setItem('test', 'value');
    expect(localStorage.getItem('test')).toBe('value');
  });
});
