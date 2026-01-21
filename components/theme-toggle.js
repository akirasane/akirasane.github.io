/**
 * Theme Toggle Web Component
 * Provides a button to switch between dark and light themes
 * Persists user preference to localStorage
 */
class ThemeToggle extends HTMLElement {
  constructor() {
    super();
    this._currentTheme = 'dark'; // Default to dark mode
  }

  connectedCallback() {
    this.render();
    this.loadPreference();
    this.attachEventListeners();
  }

  render() {
    this.innerHTML = `
      <button 
        id="theme-toggle-btn"
        class="theme-toggle-button"
        aria-label="Toggle theme"
        aria-pressed="false"
        style="
          background: transparent;
          border: 2px solid var(--border-color);
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          width: 44px;
          height: 44px;
        "
      >
        <!-- Sun icon (for light mode) -->
        <svg 
          id="sun-icon" 
          class="theme-icon" 
          style="display: none; width: 24px; height: 24px; color: var(--accent-primary);"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          aria-hidden="true"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        
        <!-- Moon icon (for dark mode) -->
        <svg 
          id="moon-icon" 
          class="theme-icon" 
          style="display: block; width: 24px; height: 24px; color: var(--accent-primary);"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          aria-hidden="true"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </button>
    `;
  }

  attachEventListeners() {
    const button = this.querySelector('#theme-toggle-btn');
    if (button) {
      button.addEventListener('click', () => this.toggleTheme());
      
      // Hover effect
      button.addEventListener('mouseenter', () => {
        button.style.borderColor = 'var(--accent-primary)';
        button.style.transform = 'scale(1.05)';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.borderColor = 'var(--border-color)';
        button.style.transform = 'scale(1)';
      });
    }
  }

  /**
   * Toggle between dark and light themes
   */
  toggleTheme() {
    const newTheme = this._currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  /**
   * Set the theme to a specific value
   * @param {string} theme - 'dark' or 'light'
   */
  setTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') {
      console.warn('[ThemeToggle] Invalid theme:', theme);
      return;
    }

    this._currentTheme = theme;
    this.applyTheme(theme);
    this.savePreference(theme);
    this.updateIcons(theme);
    this.updateAriaPressed(theme);
    
    // Track theme toggle
    if (window.analytics) {
      window.analytics.trackThemeToggle(theme);
    }
  }

  /**
   * Apply the theme to the document
   * @param {string} theme - 'dark' or 'light'
   */
  applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  /**
   * Update icon visibility based on theme
   * @param {string} theme - 'dark' or 'light'
   */
  updateIcons(theme) {
    const sunIcon = this.querySelector('#sun-icon');
    const moonIcon = this.querySelector('#moon-icon');

    if (theme === 'light') {
      // Show sun icon in light mode (to switch back to dark)
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
    } else {
      // Show moon icon in dark mode (to switch to light)
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
    }
  }

  /**
   * Update ARIA pressed state
   * @param {string} theme - 'dark' or 'light'
   */
  updateAriaPressed(theme) {
    const button = this.querySelector('#theme-toggle-btn');
    if (button) {
      button.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    }
  }

  /**
   * Save theme preference to localStorage
   * @param {string} theme - 'dark' or 'light'
   */
  savePreference(theme) {
    try {
      localStorage.setItem('theme-preference', theme);
    } catch (error) {
      console.error('[ThemeToggle] Failed to save preference:', error);
    }
  }

  /**
   * Load theme preference from localStorage
   */
  loadPreference() {
    try {
      const savedTheme = localStorage.getItem('theme-preference');
      
      if (savedTheme === 'light' || savedTheme === 'dark') {
        this.setTheme(savedTheme);
      } else {
        // Default to dark mode if no preference
        this.setTheme('dark');
      }
    } catch (error) {
      console.error('[ThemeToggle] Failed to load preference:', error);
      // Default to dark mode on error
      this.setTheme('dark');
    }
  }

  /**
   * Get the current theme
   * @returns {string} 'dark' or 'light'
   */
  get currentTheme() {
    return this._currentTheme;
  }
}

// Register the custom element
customElements.define('theme-toggle', ThemeToggle);
