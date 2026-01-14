class SkillCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.classList.add('fade-in');
        this.render();
    }

    get title() {
        return this.getAttribute('title') || 'Skills';
    }

    get color() {
        return this.getAttribute('color') || 'indigo';
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
                    background-color: #1f2937;
                    padding: 1.5rem;
                    border-radius: 0.5rem;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
                    transition: box-shadow 0.2s ease;
                    animation: fadeInUp 0.6s ease-out;
                    border: 1px solid #374151;
                }

                .card:hover {
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                }

                .title {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: ${color};
                    margin-bottom: 1rem;
                }

                .skills {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
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
                <h3 class="title">${this.title}</h3>
                <div class="skills">
                    <slot></slot>
                </div>
            </div>
        `;
    }
}

customElements.define('skill-card', SkillCard);
