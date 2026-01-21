/**
 * IntersectionObserverManager
 * 
 * Centralized management of scroll animations using Intersection Observer API.
 * Provides reusable animation patterns and respects user's motion preferences.
 * 
 * Features:
 * - Single observer instance for performance
 * - Configurable thresholds and root margins
 * - Respects prefers-reduced-motion setting
 * - Automatic cleanup
 * - Reusable animation patterns (fadeIn, slideUp, staggerChildren)
 */

class IntersectionObserverManager {
    /**
     * Create an IntersectionObserverManager instance
     * @param {Object} options - Configuration options
     * @param {number|number[]} options.threshold - Visibility threshold(s) (0-1)
     * @param {string} options.rootMargin - Root margin for observer
     * @param {boolean} options.once - Whether to observe elements only once
     */
    constructor(options = {}) {
        this.options = {
            threshold: options.threshold || 0.1,
            rootMargin: options.rootMargin || '0px 0px -50px 0px',
            once: options.once !== undefined ? options.once : true
        };

        // Check if user prefers reduced motion
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Store callbacks for each observed element
        this.callbacks = new Map();

        // Create the observer
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            {
                threshold: this.options.threshold,
                rootMargin: this.options.rootMargin
            }
        );
    }

    /**
     * Handle intersection events
     * @param {IntersectionObserverEntry[]} entries - Array of intersection entries
     */
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const callback = this.callbacks.get(entry.target);
                if (callback) {
                    callback(entry);
                }

                // Unobserve if once option is true
                if (this.options.once) {
                    this.unobserve(entry.target);
                }
            }
        });
    }

    /**
     * Observe an element with a callback
     * @param {HTMLElement} element - Element to observe
     * @param {Function} callback - Callback to execute when element intersects
     */
    observe(element, callback) {
        if (!element || !(element instanceof HTMLElement)) {
            console.warn('IntersectionObserverManager: Invalid element provided to observe()');
            return;
        }

        this.callbacks.set(element, callback);
        this.observer.observe(element);
    }

    /**
     * Stop observing an element
     * @param {HTMLElement} element - Element to stop observing
     */
    unobserve(element) {
        if (!element) return;

        this.observer.unobserve(element);
        this.callbacks.delete(element);
    }

    /**
     * Disconnect the observer and clear all callbacks
     */
    disconnect() {
        this.observer.disconnect();
        this.callbacks.clear();
    }

    /**
     * Static method: Apply fade-in animation to an element
     * @param {HTMLElement} element - Element to animate
     * @param {number} delay - Delay before animation starts (ms)
     */
    static fadeIn(element, delay = 0) {
        if (!element) return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            // Skip animation, just make visible
            element.classList.add('visible');
            return;
        }

        setTimeout(() => {
            element.classList.add('visible');
            
            // Remove animation class after completion to improve performance
            element.addEventListener('transitionend', function handler() {
                element.removeEventListener('transitionend', handler);
            }, { once: true });
        }, delay);
    }

    /**
     * Static method: Apply slide-up animation to an element
     * @param {HTMLElement} element - Element to animate
     * @param {number} delay - Delay before animation starts (ms)
     */
    static slideUp(element, delay = 0) {
        if (!element) return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            // Skip animation, just make visible
            element.classList.add('visible');
            return;
        }

        setTimeout(() => {
            element.classList.add('slide-up', 'visible');
            
            // Remove animation class after completion
            element.addEventListener('transitionend', function handler() {
                element.classList.remove('slide-up');
                element.removeEventListener('transitionend', handler);
            }, { once: true });
        }, delay);
    }

    /**
     * Static method: Apply staggered animations to multiple elements
     * @param {HTMLElement} parent - Parent element containing children to animate
     * @param {number} staggerDelay - Delay between each child animation (ms)
     * @param {string} animationType - Type of animation ('fadeIn' or 'slideUp')
     */
    static staggerChildren(parent, staggerDelay = 100, animationType = 'fadeIn') {
        if (!parent) return;

        const children = Array.from(parent.children);
        
        children.forEach((child, index) => {
            const delay = index * staggerDelay;
            
            if (animationType === 'slideUp') {
                IntersectionObserverManager.slideUp(child, delay);
            } else {
                IntersectionObserverManager.fadeIn(child, delay);
            }
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IntersectionObserverManager;
}
