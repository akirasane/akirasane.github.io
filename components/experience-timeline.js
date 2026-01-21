class ExperienceTimeline extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.experiences = [];
        this.currentIndex = 0;
        this.dataSource = this.getAttribute('data-source') || 'data/experiences.json';
    }

    connectedCallback() {
        this.showSkeletonLoader();
        this.loadExperiences();
    }

    showSkeletonLoader() {
        this.shadowRoot.innerHTML = `
            <style>
                .skeleton-container {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .skeleton-nav {
                    display: flex;
                    justify-content: center;
                    gap: 2rem;
                    margin-bottom: 2rem;
                    padding: 1.5rem 0;
                }

                .skeleton-dot {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(90deg, rgba(99, 102, 241, 0.1) 25%, rgba(99, 102, 241, 0.2) 50%, rgba(99, 102, 241, 0.1) 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                }

                .skeleton-card {
                    background: linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%);
                    backdrop-filter: blur(10px);
                    padding: 2rem;
                    border-radius: 1.5rem;
                    border: 1px solid rgba(99, 102, 241, 0.2);
                    height: 400px;
                }

                .skeleton-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1.5rem;
                    gap: 1rem;
                }

                .skeleton-title {
                    width: 60%;
                    height: 2rem;
                    background: linear-gradient(90deg, rgba(99, 102, 241, 0.1) 25%, rgba(99, 102, 241, 0.2) 50%, rgba(99, 102, 241, 0.1) 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    border-radius: 0.5rem;
                    margin-bottom: 0.5rem;
                }

                .skeleton-company {
                    width: 40%;
                    height: 1.5rem;
                    background: linear-gradient(90deg, rgba(99, 102, 241, 0.1) 25%, rgba(99, 102, 241, 0.2) 50%, rgba(99, 102, 241, 0.1) 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    border-radius: 0.5rem;
                }

                .skeleton-period {
                    width: 120px;
                    height: 2rem;
                    background: linear-gradient(90deg, rgba(99, 102, 241, 0.1) 25%, rgba(99, 102, 241, 0.2) 50%, rgba(99, 102, 241, 0.1) 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    border-radius: 0.5rem;
                }

                .skeleton-description {
                    width: 100%;
                    height: 1rem;
                    background: linear-gradient(90deg, rgba(99, 102, 241, 0.1) 25%, rgba(99, 102, 241, 0.2) 50%, rgba(99, 102, 241, 0.1) 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    border-radius: 0.5rem;
                    margin-bottom: 0.75rem;
                }

                .skeleton-project {
                    background: rgba(15, 23, 42, 0.5);
                    padding: 1.25rem;
                    border-radius: 1rem;
                    margin-bottom: 1rem;
                }

                .skeleton-project-title {
                    width: 50%;
                    height: 1.25rem;
                    background: linear-gradient(90deg, rgba(99, 102, 241, 0.1) 25%, rgba(99, 102, 241, 0.2) 50%, rgba(99, 102, 241, 0.1) 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    border-radius: 0.5rem;
                    margin-bottom: 0.75rem;
                }

                .skeleton-project-desc {
                    width: 100%;
                    height: 0.875rem;
                    background: linear-gradient(90deg, rgba(99, 102, 241, 0.1) 25%, rgba(99, 102, 241, 0.2) 50%, rgba(99, 102, 241, 0.1) 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    border-radius: 0.5rem;
                    margin-bottom: 0.5rem;
                }

                .skeleton-tags {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }

                .skeleton-tag {
                    width: 80px;
                    height: 1.75rem;
                    background: linear-gradient(90deg, rgba(99, 102, 241, 0.1) 25%, rgba(99, 102, 241, 0.2) 50%, rgba(99, 102, 241, 0.1) 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    border-radius: 0.5rem;
                }

                @keyframes shimmer {
                    0% {
                        background-position: 200% 0;
                    }
                    100% {
                        background-position: -200% 0;
                    }
                }

                @media (max-width: 768px) {
                    .skeleton-nav {
                        gap: 1rem;
                        padding: 1rem 0;
                    }

                    .skeleton-dot {
                        width: 40px;
                        height: 40px;
                    }

                    .skeleton-card {
                        padding: 1.5rem;
                        height: 450px;
                    }
                }
            </style>

            <div class="skeleton-container">
                <!-- Skeleton Navigation -->
                <div class="skeleton-nav">
                    <div class="skeleton-dot"></div>
                    <div class="skeleton-dot"></div>
                    <div class="skeleton-dot"></div>
                    <div class="skeleton-dot"></div>
                </div>

                <!-- Skeleton Card -->
                <div class="skeleton-card">
                    <div class="skeleton-header">
                        <div style="flex: 1;">
                            <div class="skeleton-title"></div>
                            <div class="skeleton-company"></div>
                        </div>
                        <div class="skeleton-period"></div>
                    </div>
                    
                    <div class="skeleton-description"></div>
                    <div class="skeleton-description" style="width: 90%;"></div>
                    <div class="skeleton-description" style="width: 70%; margin-bottom: 1.5rem;"></div>
                    
                    <div class="skeleton-project">
                        <div class="skeleton-project-title"></div>
                        <div class="skeleton-project-desc"></div>
                        <div class="skeleton-project-desc" style="width: 80%;"></div>
                        <div class="skeleton-tags">
                            <div class="skeleton-tag"></div>
                            <div class="skeleton-tag"></div>
                            <div class="skeleton-tag"></div>
                        </div>
                    </div>
                    
                    <div class="skeleton-project">
                        <div class="skeleton-project-title"></div>
                        <div class="skeleton-project-desc"></div>
                        <div class="skeleton-project-desc" style="width: 85%;"></div>
                        <div class="skeleton-tags">
                            <div class="skeleton-tag"></div>
                            <div class="skeleton-tag"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async loadExperiences() {
        try {
            const response = await fetch(this.dataSource);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.experiences = data.experiences || [];
            
            if (this.experiences.length > 0) {
                this.render();
                this.attachEventListeners();
            } else {
                this.showNoDataMessage();
            }
        } catch (error) {
            console.error('[ExperienceTimeline] Error loading experiences:', error);
            this.showErrorMessage(error);
        }
    }

    showNoDataMessage() {
        this.shadowRoot.innerHTML = `
            <style>
                .message-container {
                    text-align: center;
                    padding: 2rem;
                    color: #9ca3af;
                }
            </style>
            <div class="message-container">
                <p>No experience data found.</p>
            </div>
        `;
    }

    showErrorMessage(error) {
        this.shadowRoot.innerHTML = `
            <style>
                .error-container {
                    text-align: center;
                    padding: 2rem;
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    border-radius: 1rem;
                    max-width: 600px;
                    margin: 0 auto;
                }
                .error-title {
                    color: #ef4444;
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-bottom: 0.75rem;
                }
                .error-message {
                    color: #fca5a5;
                    margin-bottom: 1.5rem;
                    font-size: 0.9375rem;
                }
                .retry-button {
                    padding: 0.75rem 1.5rem;
                    background: rgba(239, 68, 68, 0.2);
                    color: #fca5a5;
                    border: 1px solid rgba(239, 68, 68, 0.4);
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }
                .retry-button:hover {
                    background: rgba(239, 68, 68, 0.3);
                    border-color: rgba(239, 68, 68, 0.6);
                    transform: translateY(-2px);
                }
                .retry-button:active {
                    transform: translateY(0);
                }
            </style>
            <div class="error-container">
                <div class="error-title">Failed to Load Experience Data</div>
                <div class="error-message">
                    Unable to connect. Please check your internet connection and try again.
                </div>
                <button class="retry-button" id="retryButton">
                    <svg style="display: inline-block; width: 1rem; height: 1rem; margin-right: 0.5rem; vertical-align: middle;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Retry
                </button>
            </div>
        `;

        // Attach retry button event listener
        const retryButton = this.shadowRoot.getElementById('retryButton');
        if (retryButton) {
            retryButton.addEventListener('click', () => {
                this.shadowRoot.innerHTML = '<p style="color: #9ca3af; text-align: center; padding: 2rem;">Loading experiences...</p>';
                this.loadExperiences();
            });
        }
    }

    getColorClasses(color) {
        const colorMap = {
            indigo: {
                primary: '#6366f1',
                secondary: '#818cf8',
                glow: 'rgba(99, 102, 241, 0.4)',
                border: 'rgba(99, 102, 241, 0.3)'
            },
            emerald: {
                primary: '#10b981',
                secondary: '#34d399',
                glow: 'rgba(16, 185, 129, 0.4)',
                border: 'rgba(16, 185, 129, 0.3)'
            },
            gray: {
                primary: '#6b7280',
                secondary: '#9ca3af',
                glow: 'rgba(107, 114, 128, 0.4)',
                border: 'rgba(107, 114, 128, 0.3)'
            }
        };
        return colorMap[color] || colorMap.indigo;
    }

    render() {
        if (this.experiences.length === 0) {
            this.shadowRoot.innerHTML = '<p style="color: white;">Loading experiences...</p>';
            return;
        }

        const exp = this.experiences[this.currentIndex];
        const colors = this.getColorClasses(exp.color);

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }

                .timeline-container {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                /* Timeline Navigation */
                .timeline-nav {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    position: relative;
                    padding: 1.5rem 0;
                    flex-shrink: 0;
                }

                .timeline-line {
                    position: absolute;
                    top: 50%;
                    left: 10%;
                    right: 10%;
                    height: 2px;
                    background: linear-gradient(90deg, 
                        rgba(99, 102, 241, 0.2) 0%, 
                        rgba(168, 85, 247, 0.3) 50%, 
                        rgba(99, 102, 241, 0.2) 100%);
                    z-index: 0;
                }

                .timeline-dots {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    max-width: 800px;
                    position: relative;
                    z-index: 1;
                }

                .timeline-dot {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.75rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .dot {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: rgba(99, 102, 241, 0.3);
                    border: 2px solid rgba(99, 102, 241, 0.5);
                    transition: all 0.3s ease;
                    position: relative;
                }

                .dot::after {
                    content: '';
                    position: absolute;
                    inset: -8px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .timeline-dot:hover .dot {
                    transform: scale(1.3);
                    background: rgba(99, 102, 241, 0.6);
                    box-shadow: 0 0 20px rgba(99, 102, 241, 0.6);
                }

                .timeline-dot:hover .dot::after {
                    opacity: 1;
                }

                .timeline-dot.active .dot {
                    width: 20px;
                    height: 20px;
                    background: linear-gradient(135deg, #6366f1, #a855f7);
                    border-color: #6366f1;
                    box-shadow: 0 0 30px rgba(99, 102, 241, 0.8);
                }

                .timeline-dot.active .dot::after {
                    opacity: 1;
                }

                .year-label {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #9ca3af;
                    transition: all 0.3s ease;
                }

                .timeline-dot.active .year-label {
                    color: #6366f1;
                    font-size: 1rem;
                    text-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
                }

                .timeline-dot:hover .year-label {
                    color: #818cf8;
                }

                /* Experience Card */
                .experience-card {
                    background: linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%);
                    backdrop-filter: blur(10px);
                    padding: 2rem;
                    border-radius: 1.5rem;
                    border: 1px solid ${colors.border};
                    box-shadow: 
                        0 0 0 1px ${colors.border},
                        0 30px 60px rgba(0, 0, 0, 0.5),
                        inset 0 0 80px rgba(99, 102, 241, 0.05);
                    position: relative;
                    overflow-y: auto;
                    overflow-x: hidden;
                    animation: slideIn 0.5s ease-out;
                    height: 400px;
                }

                /* Custom scrollbar */
                .experience-card::-webkit-scrollbar {
                    width: 8px;
                }

                .experience-card::-webkit-scrollbar-track {
                    background: rgba(15, 23, 42, 0.5);
                    border-radius: 4px;
                }

                .experience-card::-webkit-scrollbar-thumb {
                    background: ${colors.primary};
                    border-radius: 4px;
                    opacity: 0.5;
                }

                .experience-card::-webkit-scrollbar-thumb:hover {
                    background: ${colors.secondary};
                }

                .experience-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, ${colors.primary}, ${colors.secondary});
                }

                .experience-card::after {
                    content: '';
                    position: absolute;
                    top: -50%;
                    right: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle, ${colors.glow} 0%, transparent 60%);
                    opacity: 0.3;
                    pointer-events: none;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .card-header {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    position: relative;
                    z-index: 1;
                    flex-shrink: 0;
                }

                @media (min-width: 768px) {
                    .card-header {
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: flex-start;
                    }
                }

                .job-title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin: 0 0 0.5rem 0;
                    letter-spacing: -0.025em;
                    line-height: 1.2;
                }

                .company-name {
                    font-size: 1.125rem;
                    color: #e5e7eb;
                    font-weight: 500;
                    line-height: 1.4;
                }

                .period {
                    color: #9ca3af;
                    font-size: 0.875rem;
                    padding: 0.5rem 1rem;
                    background: rgba(99, 102, 241, 0.1);
                    border-radius: 0.5rem;
                    border: 1px solid rgba(99, 102, 241, 0.2);
                    white-space: nowrap;
                    align-self: flex-start;
                }

                .description {
                    color: #d1d5db;
                    font-size: 1rem;
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                    position: relative;
                    z-index: 1;
                }

                .projects-section {
                    position: relative;
                    z-index: 1;
                }

                .projects-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #f3f4f6;
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .projects-title::before {
                    content: '';
                    width: 4px;
                    height: 1.25rem;
                    background: linear-gradient(180deg, ${colors.primary}, ${colors.secondary});
                    border-radius: 2px;
                }

                .projects {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .project {
                    background: rgba(15, 23, 42, 0.5);
                    padding: 1.25rem;
                    border-radius: 1rem;
                    border-left: 4px solid ${colors.primary};
                    transition: all 0.3s ease;
                }

                .project:hover {
                    background: rgba(15, 23, 42, 0.7);
                    transform: translateX(8px);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                }

                .project-title {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: #f3f4f6;
                    margin: 0 0 0.5rem 0;
                }

                .project-description {
                    color: #d1d5db;
                    font-size: 0.9375rem;
                    line-height: 1.5;
                    margin-bottom: 0.75rem;
                }

                .project-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .tag {
                    padding: 0.375rem 0.875rem;
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }

                .tag-indigo {
                    background: rgba(99, 102, 241, 0.2);
                    color: #a5b4fc;
                    border: 1px solid rgba(99, 102, 241, 0.3);
                }

                .tag-indigo:hover {
                    background: rgba(99, 102, 241, 0.3);
                    transform: translateY(-2px);
                }

                .tag-emerald {
                    background: rgba(16, 185, 129, 0.2);
                    color: #6ee7b7;
                    border: 1px solid rgba(16, 185, 129, 0.3);
                }

                .tag-emerald:hover {
                    background: rgba(16, 185, 129, 0.3);
                    transform: translateY(-2px);
                }

                .tag-gray {
                    background: rgba(107, 114, 128, 0.2);
                    color: #d1d5db;
                    border: 1px solid rgba(107, 114, 128, 0.3);
                }

                .tag-gray:hover {
                    background: rgba(107, 114, 128, 0.3);
                    transform: translateY(-2px);
                }

                @media (max-width: 768px) {
                    .timeline-line {
                        left: 5%;
                        right: 5%;
                    }

                    .timeline-dots {
                        max-width: 100%;
                        padding: 0 1rem;
                    }

                    .year-label {
                        font-size: 0.75rem;
                    }

                    .timeline-dot.active .year-label {
                        font-size: 0.875rem;
                    }

                    .timeline-nav {
                        padding: 1rem 0;
                        margin-bottom: 1.5rem;
                    }

                    .experience-card {
                        padding: 1.5rem;
                        height: 450px;
                    }

                    .job-title {
                        font-size: 1.5rem;
                    }

                    .company-name {
                        font-size: 1rem;
                    }

                    .description {
                        font-size: 0.9375rem;
                    }

                    .project {
                        padding: 1rem;
                    }

                    .project-title {
                        font-size: 1rem;
                    }

                    .project-description {
                        font-size: 0.875rem;
                    }
                }
            </style>

            <div class="timeline-container">
                <!-- Timeline Navigation -->
                <div class="timeline-nav">
                    <div class="timeline-line"></div>
                    <div class="timeline-dots">
                        ${this.experiences.map((experience, index) => `
                            <div class="timeline-dot ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                                <div class="dot"></div>
                                <span class="year-label">${experience.year}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Experience Card -->
                <div class="experience-card">
                    <div class="card-header">
                        <div>
                            <h3 class="job-title">${exp.title}</h3>
                            <p class="company-name">${exp.company}</p>
                        </div>
                        <span class="period">${exp.period}</span>
                    </div>
                    <p class="description">${exp.description}</p>
                    
                    ${exp.projects.length > 0 ? `
                        <div class="projects-section">
                            <h4 class="projects-title">Key Projects</h4>
                            <div class="projects">
                                ${exp.projects.map(proj => `
                                    <div class="project">
                                        <h5 class="project-title">${proj.title}</h5>
                                        <p class="project-description">${proj.description}</p>
                                        <div class="project-tags">
                                            ${proj.tags.map(tag => `
                                                <span class="tag tag-${tag.color}">${tag.text}</span>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const dots = this.shadowRoot.querySelectorAll('.timeline-dot');
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.getAttribute('data-index'));
                if (index !== this.currentIndex) {
                    this.currentIndex = index;
                    this.render();
                    this.attachEventListeners();
                }
            });
        });
    }
}

customElements.define('experience-timeline', ExperienceTimeline);
