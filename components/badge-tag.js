class BadgeTag extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    get color() {
        return this.getAttribute('color') || 'indigo';
    }

    get size() {
        return this.getAttribute('size') || 'md';
    }

    getStyles() {
        const colorMap = {
            indigo: { bg: '#e0e7ff', text: '#1e40af' },
            emerald: { bg: '#d1fae5', text: '#065f46' },
            gray: { bg: '#f3f4f6', text: '#1f2937' }
        };

        const sizeMap = {
            sm: { padding: '0.25rem 0.5rem', fontSize: '0.75rem' },
            md: { padding: '0.25rem 0.75rem', fontSize: '0.875rem' },
            lg: { padding: '0.5rem 1rem', fontSize: '1rem' }
        };

        const colors = colorMap[this.color] || colorMap.indigo;
        const sizes = sizeMap[this.size] || sizeMap.md;

        return `
            :host {
                display: inline-block;
            }
            
            span {
                display: inline-block;
                background-color: ${colors.bg};
                color: ${colors.text};
                padding: ${sizes.padding};
                border-radius: 9999px;
                font-size: ${sizes.fontSize};
                font-weight: 500;
                transition: all 0.2s ease;
                white-space: nowrap;
            }

            span:hover {
                opacity: 0.8;
                transform: translateY(-1px);
            }
        `;
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>${this.getStyles()}</style>
            <span><slot></slot></span>
        `;
    }
}

customElements.define('badge-tag', BadgeTag);
