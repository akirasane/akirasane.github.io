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

    getColorClasses() {
        const colorMap = {
            indigo: {
                primary: '#6366f1',
                secondary: '#818cf8',
                glow: 'rgba(99, 102, 241, 0.3)',
                border: 'rgba(99, 102, 241, 0.2)'
            },
            emerald: {
                primary: '#10b981',
                secondary: '#34d399',
                glow: 'rgba(16, 185, 129, 0.3)',
                border: 'rgba(16, 185, 129, 0.2)'
            },
            gray: {
                primary: '#6b7280',
                secondary: '#9ca3af',
                glow: 'rgba(107, 114, 128, 0.3)',
                border: 'rgba(107, 114, 128, 0.2)'
            }
        };
        return colorMap[this.color] || colorMap.indigo;
    }

    render() {
        const colors = this.getColorClasses();
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }

                .card {
                    background: linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%);
                    backdrop-filter: blur(10px);
                    padding: 2rem;
                    border-radius: 1.25rem;
                    border: 1px solid ${colors.border};
                    box-shadow: 
                        0 0 0 1px ${colors.border},
                        0 20px 40px rgba(0, 0, 0, 0.4),
                        inset 0 0 60px rgba(99, 102, 241, 0.05);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    animation: fadeInUp 0.6s ease-out;
                    position: relative;
                    overflow: hidden;
                }

                .card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, ${colors.primary}, ${colors.secondary});
                    opacity: 0.8;
                }

                .card::after {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle, ${colors.glow} 0%, transparent 70%);
                    opacity: 0;
                    transition: opacity 0.4s ease;
                }

                .card:hover {
                    transform: translateY(-8px);
                    border-color: ${colors.primary};
                    box-shadow: 
                        0 0 0 1px ${colors.primary},
                        0 30px 60px rgba(0, 0, 0, 0.5),
                        0 0 80px ${colors.glow},
                        inset 0 0 80px rgba(99, 102, 241, 0.1);
                }

                .card:hover::after {
                    opacity: 1;
                }

                .title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 1.5rem;
                    position: relative;
                    z-index: 1;
                    letter-spacing: -0.025em;
                }

                .skills {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.75rem;
                    position: relative;
                    z-index: 1;
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
