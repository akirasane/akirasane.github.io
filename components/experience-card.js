class ExperienceCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.classList.add('fade-in');
        this.render();
    }

    get title() {
        return this.getAttribute('title') || 'Job Title';
    }

    get company() {
        return this.getAttribute('company') || 'Company';
    }

    get period() {
        return this.getAttribute('period') || 'Period';
    }

    get color() {
        return this.getAttribute('color') || 'indigo';
    }

    get description() {
        return this.getAttribute('description') || '';
    }

    getColorValue() {
        const colorMap = {
            indigo: '#4f46e5',
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

                .card {
                    background-color: #f9fafb;
                    padding: 2rem;
                    border-radius: 0.5rem;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
                    transition: box-shadow 0.2s ease;
                    animation: fadeInUp 0.6s ease-out;
                }

                .card:hover {
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                }

                .header {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                @media (min-width: 768px) {
                    .header {
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: flex-start;
                    }
                }

                .info h3 {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #111827;
                    margin: 0;
                }

                .company {
                    font-size: 1.125rem;
                    color: ${color};
                    margin-top: 0.25rem;
                }

                .period {
                    color: #6b7280;
                    font-size: 0.875rem;
                    white-space: nowrap;
                }

                .description {
                    color: #4b5563;
                    margin-bottom: 1rem;
                }

                .projects {
                    margin-top: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            </style>

            <div class="card">
                <div class="header">
                    <div class="info">
                        <h3>${this.title}</h3>
                        <p class="company">${this.company}</p>
                    </div>
                    <span class="period">${this.period}</span>
                </div>
                <p class="description">${this.description}</p>
                <div class="projects">
                    <slot></slot>
                </div>
            </div>
        `;
    }
}

customElements.define('experience-card', ExperienceCard);
