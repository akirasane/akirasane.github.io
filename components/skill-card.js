class SkillCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.skills = [];
        this.isAnimated = false;
    }

    connectedCallback() {
        this.classList.add('fade-in');
        this.loadSkills();
    }

    async loadSkills() {
        const dataSource = this.getAttribute('data-source');
        
        if (dataSource) {
            try {
                console.log(`Loading skills for "${this.title}" from ${dataSource}`);
                const response = await fetch(dataSource);
                if (!response.ok) {
                    throw new Error(`Failed to load skills: ${response.status}`);
                }
                const data = await response.json();
                console.log('Skills data loaded:', data);
                
                // Find the category matching this card's title
                const category = data.skills.find(cat => cat.category === this.title);
                if (category) {
                    this.skills = category.items;
                    console.log(`Found ${this.skills.length} skills for "${this.title}"`);
                } else {
                    console.warn(`No category found for "${this.title}"`);
                }
            } catch (error) {
                console.error('Error loading skills:', error);
            }
        } else {
            console.log(`No data-source attribute for "${this.title}", using slot content`);
        }
        
        this.render();
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isAnimated) {
                    this.animateProgressBars();
                    this.isAnimated = true;
                }
            });
        }, { threshold: 0.3 });

        observer.observe(this);
    }

    animateProgressBars() {
        const progressBars = this.shadowRoot.querySelectorAll('.progress-fill');
        progressBars.forEach((bar, index) => {
            const targetWidth = bar.getAttribute('data-proficiency');
            setTimeout(() => {
                bar.style.width = `${targetWidth}%`;
            }, index * 100);
        });
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
        
        // Generate skills HTML with progress bars
        let skillsHTML = '';
        if (this.skills.length > 0) {
            skillsHTML = this.skills.map(skill => `
                <div class="skill-item">
                    <div class="skill-header">
                        <span class="skill-name">${skill.name}</span>
                        <span class="skill-percentage">${skill.proficiency}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" data-proficiency="${skill.proficiency}"></div>
                    </div>
                </div>
            `).join('');
        } else {
            // Fallback to slot content if no JSON data
            const hasDataSource = this.getAttribute('data-source');
            if (hasDataSource) {
                // Show loading/error message if data-source was provided but no skills loaded
                skillsHTML = '<div class="no-skills">Loading skills...</div>';
            } else {
                skillsHTML = '<slot></slot>';
            }
        }
        
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
                    flex-direction: column;
                    gap: 1.25rem;
                    position: relative;
                    z-index: 1;
                }

                .skill-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .skill-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .skill-name {
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: #e5e7eb;
                    letter-spacing: 0.01em;
                }

                .skill-percentage {
                    font-size: 0.875rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .progress-bar {
                    width: 100%;
                    height: 8px;
                    background: rgba(31, 41, 55, 0.8);
                    border-radius: 9999px;
                    overflow: hidden;
                    position: relative;
                    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
                }

                .progress-fill {
                    height: 100%;
                    width: 0;
                    background: linear-gradient(90deg, ${colors.primary}, ${colors.secondary});
                    border-radius: 9999px;
                    transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    box-shadow: 0 0 10px ${colors.glow};
                }

                .progress-fill::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                    animation: shimmer 2s infinite;
                }

                .no-skills {
                    color: #9ca3af;
                    font-size: 0.875rem;
                    text-align: center;
                    padding: 1rem;
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

                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }

                /* Fallback for slot content (badges) */
                ::slotted(*) {
                    margin: 0.375rem;
                }
            </style>

            <div class="card">
                <h3 class="title">${this.title}</h3>
                <div class="skills">
                    ${skillsHTML}
                </div>
            </div>
        `;
    }
}

customElements.define('skill-card', SkillCard);
