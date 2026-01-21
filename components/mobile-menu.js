class MobileMenu extends HTMLElement {
  constructor() {
    super();
    this._isOpen = false;
    this.handleResize = this.handleResize.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleEscapeKey = this.handleEscapeKey.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.focusableElements = [];
    this.firstFocusableElement = null;
    this.lastFocusableElement = null;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.updateVisibility();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  render() {
    this.innerHTML = `
      <style>
        :host {
          display: block;
        }

        .mobile-menu-container {
          position: relative;
        }

        /* Hamburger button */
        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: space-around;
          width: 44px;
          height: 44px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 10px;
          z-index: 60;
          position: relative;
        }

        .hamburger span {
          width: 24px;
          height: 2px;
          background: #a5b4fc;
          border-radius: 2px;
          transition: all 0.3s ease;
          transform-origin: center;
        }

        .hamburger.open span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }

        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.open span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        /* Mobile navigation */
        .mobile-nav {
          position: fixed;
          top: 0;
          right: -100%;
          width: 80%;
          max-width: 300px;
          height: 100vh;
          background: linear-gradient(to bottom, rgba(17, 24, 39, 0.98), rgba(31, 41, 55, 0.98));
          backdrop-filter: blur(16px);
          border-left: 1px solid rgba(99, 102, 241, 0.2);
          box-shadow: -4px 0 24px rgba(99, 102, 241, 0.1);
          transition: right 0.3s ease-in-out;
          z-index: 55;
          overflow-y: auto;
          padding-top: 80px;
        }

        .mobile-nav.open {
          right: 0;
        }

        .mobile-nav ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .mobile-nav li {
          border-bottom: 1px solid rgba(99, 102, 241, 0.1);
        }

        .mobile-nav a {
          display: block;
          padding: 20px 24px;
          color: #d1d5db;
          text-decoration: none;
          font-size: 18px;
          transition: all 0.3s ease;
          position: relative;
        }

        .mobile-nav a:hover,
        .mobile-nav a:focus {
          background: rgba(99, 102, 241, 0.1);
          color: #818cf8;
          padding-left: 32px;
          outline: none;
        }

        /* Active link styling for mobile */
        .mobile-nav a.nav-active {
          color: #818cf8;
          background: rgba(99, 102, 241, 0.15);
          border-left: 3px solid #818cf8;
        }

        .mobile-nav a.nav-active:hover {
          background: rgba(99, 102, 241, 0.2);
        }

        /* Overlay */
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
          z-index: 50;
        }

        .overlay.open {
          opacity: 1;
          visibility: visible;
        }

        /* Desktop navigation */
        .desktop-nav {
          display: flex;
          gap: 32px;
        }

        .desktop-nav a {
          color: #d1d5db;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
        }

        .desktop-nav a:hover,
        .desktop-nav a:focus {
          color: #818cf8;
          transform: scale(1.1);
          outline: none;
        }

        /* Active link styling for desktop */
        .desktop-nav a.nav-active {
          color: #818cf8;
        }

        .desktop-nav a.nav-active::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(to right, #818cf8, #a78bfa);
          border-radius: 2px;
        }

        /* Responsive behavior */
        @media (max-width: 767px) {
          .hamburger {
            display: flex;
          }

          .desktop-nav {
            display: none;
          }
        }

        @media (min-width: 768px) {
          .hamburger {
            display: none;
          }

          .mobile-nav {
            display: none;
          }

          .overlay {
            display: none;
          }

          .desktop-nav {
            display: flex;
          }
        }

        /* Body scroll lock */
        body.menu-open {
          overflow: hidden;
          position: fixed;
          width: 100%;
        }
      </style>

      <div class="mobile-menu-container">
        <!-- Hamburger button -->
        <button class="hamburger" aria-label="Toggle menu" aria-expanded="false" aria-controls="mobile-navigation">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <!-- Overlay -->
        <div class="overlay" aria-hidden="true"></div>

        <!-- Mobile navigation -->
        <nav class="mobile-nav" id="mobile-navigation" role="navigation" aria-label="Mobile navigation">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#projects">Experience</a></li>
            <li><a href="#portfolio">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>

        <!-- Desktop navigation -->
        <div class="desktop-nav">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Experience</a>
          <a href="#portfolio">Projects</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    `;

    this.hamburger = this.querySelector('.hamburger');
    this.mobileNav = this.querySelector('.mobile-nav');
    this.overlay = this.querySelector('.overlay');
    this.navLinks = this.querySelectorAll('.mobile-nav a');
  }

  setupEventListeners() {
    // Hamburger click
    this.hamburger.addEventListener('click', () => this.toggle());

    // Overlay click
    this.overlay.addEventListener('click', () => this.close());

    // Navigation link clicks
    this.navLinks.forEach(link => {
      link.addEventListener('click', this.handleLinkClick);
    });

    // Window resize
    window.addEventListener('resize', this.handleResize);

    // Document click for click outside
    document.addEventListener('click', this.handleClickOutside);

    // ESC key
    document.addEventListener('keydown', this.handleEscapeKey);

    // Focus trap
    this.mobileNav.addEventListener('keydown', (e) => this.handleFocusTrap(e));
  }

  removeEventListeners() {
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('click', this.handleClickOutside);
    document.removeEventListener('keydown', this.handleEscapeKey);
  }

  handleLinkClick(e) {
    // Close menu when link is clicked
    this.close();
  }

  handleResize() {
    // Close menu if viewport is resized above 768px
    if (window.innerWidth >= 768 && this._isOpen) {
      this.close();
    }
    this.updateVisibility();
  }

  handleClickOutside(event) {
    // Close menu if click is outside the menu and hamburger
    if (this._isOpen && 
        !this.mobileNav.contains(event.target) && 
        !this.hamburger.contains(event.target)) {
      this.close();
    }
  }

  handleEscapeKey(event) {
    // Close menu on ESC key
    if (event.key === 'Escape' && this._isOpen) {
      this.close();
      this.hamburger.focus();
    }
  }

  handleFocusTrap(e) {
    // Trap focus within mobile menu when open
    if (!this._isOpen) return;

    if (e.key === 'Tab') {
      // Get all focusable elements
      this.focusableElements = Array.from(
        this.mobileNav.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')
      );

      if (this.focusableElements.length === 0) return;

      this.firstFocusableElement = this.focusableElements[0];
      this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === this.firstFocusableElement) {
          e.preventDefault();
          this.lastFocusableElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === this.lastFocusableElement) {
          e.preventDefault();
          this.firstFocusableElement.focus();
        }
      }
    }
  }

  updateVisibility() {
    // Update visibility based on viewport width
    const isMobile = window.innerWidth < 768;
    this.hamburger.style.display = isMobile ? 'flex' : 'none';
  }

  open() {
    this._isOpen = true;
    this.hamburger.classList.add('open');
    this.mobileNav.classList.add('open');
    this.overlay.classList.add('open');
    this.hamburger.setAttribute('aria-expanded', 'true');
    
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    
    // Focus first link
    setTimeout(() => {
      const firstLink = this.mobileNav.querySelector('a');
      if (firstLink) firstLink.focus();
    }, 100);
  }

  close() {
    this._isOpen = false;
    this.hamburger.classList.remove('open');
    this.mobileNav.classList.remove('open');
    this.overlay.classList.remove('open');
    this.hamburger.setAttribute('aria-expanded', 'false');
    
    // Unlock body scroll
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
  }

  toggle() {
    if (this._isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  get isOpen() {
    return this._isOpen;
  }

  set isOpen(value) {
    if (value) {
      this.open();
    } else {
      this.close();
    }
  }
}

customElements.define('mobile-menu', MobileMenu);
