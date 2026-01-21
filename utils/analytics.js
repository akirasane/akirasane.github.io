/**
 * Analytics Tracker Utility
 * 
 * Provides analytics tracking functionality with privacy controls.
 * Integrates with Google Analytics (gtag.js) or similar services.
 * 
 * Features:
 * - Track page views
 * - Track section visibility
 * - Track user interactions (clicks, form submissions)
 * - Respect user opt-out preferences
 * - GDPR compliant
 */

class AnalyticsTracker {
    constructor(config = {}) {
        this.config = {
            trackingId: config.trackingId || null,
            enabled: config.enabled !== false,
            debug: config.debug || false,
            optOutKey: config.optOutKey || 'analytics_opt_out',
            ...config
        };

        // Check if user has opted out
        this.optedOut = this.checkOptOut();

        // Initialize analytics if enabled and not opted out
        if (this.config.enabled && !this.optedOut && this.config.trackingId) {
            this.initialize();
        }

        if (this.config.debug) {
            console.log('[Analytics] Initialized', {
                enabled: this.config.enabled,
                optedOut: this.optedOut,
                trackingId: this.config.trackingId
            });
        }
    }

    /**
     * Initialize Google Analytics
     */
    initialize() {
        // Check if gtag is already loaded
        if (typeof gtag !== 'undefined') {
            if (this.config.debug) {
                console.log('[Analytics] gtag already loaded');
            }
            return;
        }

        // Load Google Analytics script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.trackingId}`;
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
            dataLayer.push(arguments);
        };
        gtag('js', new Date());
        gtag('config', this.config.trackingId, {
            anonymize_ip: true, // GDPR compliance
            cookie_flags: 'SameSite=None;Secure'
        });

        if (this.config.debug) {
            console.log('[Analytics] Google Analytics initialized');
        }
    }

    /**
     * Check if user has opted out of tracking
     * @returns {boolean}
     */
    checkOptOut() {
        try {
            const optOut = localStorage.getItem(this.config.optOutKey);
            return optOut === 'true';
        } catch (error) {
            console.error('[Analytics] Failed to check opt-out preference:', error);
            return false;
        }
    }

    /**
     * Set user opt-out preference
     * @param {boolean} optOut - Whether to opt out
     */
    setOptOut(optOut) {
        try {
            localStorage.setItem(this.config.optOutKey, optOut.toString());
            this.optedOut = optOut;

            if (this.config.debug) {
                console.log('[Analytics] Opt-out preference updated:', optOut);
            }

            // Disable Google Analytics if opted out
            if (optOut && typeof gtag !== 'undefined') {
                gtag('consent', 'update', {
                    analytics_storage: 'denied'
                });
            }
        } catch (error) {
            console.error('[Analytics] Failed to set opt-out preference:', error);
        }
    }

    /**
     * Check if tracking is allowed
     * @returns {boolean}
     */
    canTrack() {
        return this.config.enabled && !this.optedOut && this.config.trackingId;
    }

    /**
     * Track a page view
     * @param {string} path - Page path (optional, defaults to current path)
     * @param {string} title - Page title (optional, defaults to document title)
     */
    trackPageView(path = null, title = null) {
        if (!this.canTrack()) {
            if (this.config.debug) {
                console.log('[Analytics] Tracking disabled, skipping page view');
            }
            return;
        }

        const pagePath = path || window.location.pathname + window.location.search + window.location.hash;
        const pageTitle = title || document.title;

        try {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_view', {
                    page_path: pagePath,
                    page_title: pageTitle,
                    page_location: window.location.href
                });

                if (this.config.debug) {
                    console.log('[Analytics] Page view tracked:', { pagePath, pageTitle });
                }
            }
        } catch (error) {
            console.error('[Analytics] Failed to track page view:', error);
        }
    }

    /**
     * Track section visibility (when user scrolls to a section)
     * @param {string} sectionId - Section identifier
     * @param {string} sectionName - Human-readable section name
     */
    trackSectionView(sectionId, sectionName = null) {
        if (!this.canTrack()) {
            if (this.config.debug) {
                console.log('[Analytics] Tracking disabled, skipping section view');
            }
            return;
        }

        const name = sectionName || sectionId;

        try {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'section_view', {
                    event_category: 'engagement',
                    event_label: name,
                    section_id: sectionId,
                    value: 1
                });

                if (this.config.debug) {
                    console.log('[Analytics] Section view tracked:', { sectionId, name });
                }
            }
        } catch (error) {
            console.error('[Analytics] Failed to track section view:', error);
        }
    }

    /**
     * Track a custom event
     * @param {string} eventName - Event name
     * @param {Object} params - Event parameters
     */
    trackEvent(eventName, params = {}) {
        if (!this.canTrack()) {
            if (this.config.debug) {
                console.log('[Analytics] Tracking disabled, skipping event:', eventName);
            }
            return;
        }

        try {
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, {
                    event_category: params.category || 'general',
                    event_label: params.label || '',
                    value: params.value || 0,
                    ...params
                });

                if (this.config.debug) {
                    console.log('[Analytics] Event tracked:', { eventName, params });
                }
            }
        } catch (error) {
            console.error('[Analytics] Failed to track event:', error);
        }
    }

    /**
     * Track button click
     * @param {string} buttonName - Button identifier
     * @param {string} buttonLabel - Human-readable button label
     */
    trackButtonClick(buttonName, buttonLabel = null) {
        this.trackEvent('button_click', {
            category: 'interaction',
            label: buttonLabel || buttonName,
            button_name: buttonName
        });
    }

    /**
     * Track form submission
     * @param {string} formName - Form identifier
     * @param {boolean} success - Whether submission was successful
     */
    trackFormSubmission(formName, success = true) {
        this.trackEvent('form_submission', {
            category: 'engagement',
            label: formName,
            form_name: formName,
            success: success,
            value: success ? 1 : 0
        });
    }

    /**
     * Track theme toggle
     * @param {string} theme - New theme ('dark' or 'light')
     */
    trackThemeToggle(theme) {
        this.trackEvent('theme_toggle', {
            category: 'interaction',
            label: theme,
            theme: theme
        });
    }

    /**
     * Track filter usage
     * @param {string} filterType - Type of filter
     * @param {string} filterValue - Filter value
     */
    trackFilterUsage(filterType, filterValue) {
        this.trackEvent('filter_usage', {
            category: 'interaction',
            label: `${filterType}: ${filterValue}`,
            filter_type: filterType,
            filter_value: filterValue
        });
    }

    /**
     * Track download
     * @param {string} fileName - Name of downloaded file
     * @param {string} fileType - Type of file
     */
    trackDownload(fileName, fileType = 'pdf') {
        this.trackEvent('file_download', {
            category: 'engagement',
            label: fileName,
            file_name: fileName,
            file_type: fileType,
            value: 1
        });
    }

    /**
     * Track external link click
     * @param {string} url - External URL
     * @param {string} linkText - Link text
     */
    trackExternalLink(url, linkText = null) {
        this.trackEvent('external_link_click', {
            category: 'outbound',
            label: linkText || url,
            url: url,
            value: 1
        });
    }
}

// Create and export a singleton instance
// Note: trackingId should be set in production
const analytics = new AnalyticsTracker({
    trackingId: null, // Set to your Google Analytics tracking ID (e.g., 'G-XXXXXXXXXX')
    enabled: true,
    debug: false // Set to true for development
});

// Make available globally
if (typeof window !== 'undefined') {
    window.analytics = analytics;
}
