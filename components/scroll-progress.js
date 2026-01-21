/**
 * Scroll Progress Indicator Component
 * Displays a fixed progress bar at the top of the viewport showing scroll percentage
 * Requirements: 7.1, 7.2, 7.5, 7.6
 */
class ScrollProgress extends HTMLElement {
  constructor() {
    super();
    this.rafId = null;
    this.ticking = false;
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
    // Initial progress calculation
    this.updateProgress();
  }

  disconnectedCallback() {
    this.removeEventListeners();
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }

  render() {
    this.innerHTML = `
      <div class="scroll-progress-container">
        <div class="scroll-progress-bar"></div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .scroll-progress-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background-color: transparent;
        z-index: 9999;
        pointer-events: none;
      }

      .scroll-progress-bar {
        height: 100%;
        width: 0%;
        background: linear-gradient(to right, #818cf8, #a78bfa);
        transition: width 0.1s ease-out;
      }
    `;
    this.appendChild(style);
  }

  attachEventListeners() {
    this.handleScroll = this.onScroll.bind(this);
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  removeEventListeners() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  onScroll() {
    if (!this.ticking) {
      this.rafId = requestAnimationFrame(() => {
        this.updateProgress();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  updateProgress() {
    const progress = this.calculateProgress();
    const progressBar = this.querySelector('.scroll-progress-bar');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  }

  calculateProgress() {
    // Get scroll position
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Get total scrollable height
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollableHeight = documentHeight - windowHeight;

    // Handle edge case where page is not scrollable
    if (scrollableHeight <= 0) {
      return 0;
    }

    // Calculate percentage (0-100)
    const progress = (scrollTop / scrollableHeight) * 100;
    
    // Clamp between 0 and 100
    return Math.min(Math.max(progress, 0), 100);
  }

  /**
   * Get current progress percentage
   * @returns {number} Progress value between 0 and 100
   */
  get progress() {
    return this.calculateProgress();
  }
}

// Register the custom element
customElements.define('scroll-progress', ScrollProgress);
