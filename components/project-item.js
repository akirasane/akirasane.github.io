class ProjectItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    get title() {
        return this.getAttribute('title') || 'Project';
    }

    get color() {
        return this.getAttribute('color') || 'indigo';
    }

    get description() {
        return this.getAttribute('description') || '';
    }

    getColorValue() {
        const colorMap = {
            indigo: '#6366f1',
            emerald: '#059669',
            gray: '#4b5563'
        };
        return colorMap[this.color] || colorMap.indigo;
    }

    render() {
        const color = this.getColorValue();
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }

                .project {
                    border-left: 4px solid ${color};
                    padding-left: 1rem;
                }

                .title {
                    font-weight: 600;
                    color: #f3f4f6;
                    margin-bottom: 0.5rem;
                }

                .description {
                    color: #d1d5db;
                    font-size: 0.875rem;
                    margin-bottom: 0.5rem;
                }

                .tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }
            </style>

            <div class="project">
                <h4 class="title">${this.title}</h4>
                <p class="description">${this.description}</p>
                <div class="tags">
                    <slot></slot>
                </div>
            </div>
        `;
    }
}

customElements.define('project-item', ProjectItem);
