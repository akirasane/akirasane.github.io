class ProjectFilter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.activeFilter = 'all';
        this.technologies = new Set();
    }

    connectedCallback() {
        // Listen for projects-loaded event from projects-showcase
        document.addEventListener('projects-loaded', (e) => {
            console.log('[ProjectFilter] Projects loaded event received:', e.detail);
            // Wait a bit for DOM to update
            setTimeout(() => {
                this.initialize();
            }, 100);
        });
        
        // Also try to initialize after custom elements are defined (fallback)
        Promise.all([
            customElements.whenDefined('project-item'),
            customElements.whenDefined('badge-tag'),
            customElements.whenDefined('projects-showcase')
        ]).then(() => {
            // Wait for projects-showcase to load data
            setTimeout(() => {
                // Only initialize if we haven't already (from the event)
                if (this.technologies.size === 0) {
                    this.initialize();
                }
            }, 500);
        }).catch(err => {
            console.error('[ProjectFilter] Error waiting for custom elements:', err);
        });
    }

    initialize() {
        this.extractTechnologies();
        this.render();
        this.attachEventListeners();
        
        // Ensure all projects are visible on initial load
        this.showAllProjects();
        
        // Add a refresh button for debugging
        this.addRefreshButton();
    }
    
    /**
     * Add a refresh button to manually re-extract technologies (for debugging)
     */
    addRefreshButton() {
        const container = this.shadowRoot.querySelector('.filter-container');
        if (container && this.technologies.size === 0) {
            const refreshBtn = document.createElement('button');
            refreshBtn.className = 'filter-btn';
            refreshBtn.textContent = '🔄 Refresh Filters';
            refreshBtn.style.marginTop = '0.5rem';
            refreshBtn.addEventListener('click', () => {
                this.extractTechnologies();
                this.render();
                this.attachEventListeners();
            });
            container.appendChild(refreshBtn);
        }
    }

    /**
     * Extract unique technologies from all project items
     */
    extractTechnologies() {
        // Clear existing technologies
        this.technologies.clear();
        
        // Find all project-item elements in the document
        const projectItems = document.querySelectorAll('project-item');
        
        console.log('[ProjectFilter] Found project items:', projectItems.length);
        
        projectItems.forEach((project, index) => {
            // badge-tag elements are children of project-item (light DOM)
            const badges = project.querySelectorAll('badge-tag');
            console.log(`[ProjectFilter] Project ${index + 1} badges:`, badges.length);
            
            badges.forEach(badge => {
                const tech = badge.textContent.trim();
                if (tech) {
                    console.log('[ProjectFilter] Adding technology:', tech);
                    this.technologies.add(tech);
                }
            });
        });
        
        console.log('[ProjectFilter] Total unique technologies:', this.technologies.size, Array.from(this.technologies));
    }

    /**
     * Filter projects by technology
     * @param {string} technology - The technology to filter by
     */
    filterProjects(technology) {
        const projectItems = document.querySelectorAll('project-item');
        let visibleCount = 0;

        projectItems.forEach(project => {
            const badges = project.querySelectorAll('badge-tag');
            const projectTechs = Array.from(badges).map(badge => badge.textContent.trim());
            
            const shouldShow = projectTechs.includes(technology);
            
            // Find the outermost container (the grid item with fade-in class)
            const container = this.findProjectContainer(project);
            
            if (shouldShow) {
                this.showProject(container);
                visibleCount++;
            } else {
                this.hideProject(container);
            }
        });

        this.activeFilter = technology;
        this.updateActiveFilter();
        this.updateProjectCount(visibleCount);
        
        // Track filter usage
        if (window.analytics) {
            window.analytics.trackFilterUsage('project_technology', technology);
        }
    }

    /**
     * Show all projects
     */
    showAllProjects() {
        const projectItems = document.querySelectorAll('project-item');
        
        projectItems.forEach(project => {
            const container = this.findProjectContainer(project);
            this.showProject(container);
        });

        this.activeFilter = 'all';
        this.updateActiveFilter();
        this.updateProjectCount(projectItems.length);
        
        // Track filter usage
        if (window.analytics) {
            window.analytics.trackFilterUsage('project_technology', 'all');
        }
    }

    /**
     * Find the outermost container for a project (usually the grid item)
     * @param {HTMLElement} projectItem - The project-item element
     * @returns {HTMLElement} The container element to show/hide
     */
    findProjectContainer(projectItem) {
        // Look for the parent with class 'fade-in' (the grid item)
        let element = projectItem;
        while (element && element.parentElement) {
            if (element.classList && element.classList.contains('fade-in')) {
                return element;
            }
            element = element.parentElement;
        }
        // Fallback to the project item itself if no container found
        return projectItem;
    }

    /**
     * Show a project with fade-in animation
     * @param {HTMLElement} container - The container element to show
     */
    showProject(container) {
        // Reset display and visibility
        container.style.display = '';
        container.style.visibility = 'visible';
        
        // Force reflow
        container.offsetHeight;
        
        // Apply transition and show
        container.style.transition = 'opacity 300ms ease, transform 300ms ease';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }

    /**
     * Hide a project with fade-out animation
     * @param {HTMLElement} container - The container element to hide
     */
    hideProject(container) {
        container.style.transition = 'opacity 300ms ease, transform 300ms ease';
        container.style.opacity = '0';
        container.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            container.style.display = 'none';
        }, 300);
    }

    /**
     * Update active filter button styling
     */
    updateActiveFilter() {
        const buttons = this.shadowRoot.querySelectorAll('.filter-btn');
        buttons.forEach(btn => {
            const tech = btn.dataset.tech;
            if (tech === this.activeFilter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    /**
     * Update the project count display
     * @param {number} count - Number of visible projects
     */
    updateProjectCount(count) {
        const countElement = this.shadowRoot.querySelector('.project-count');
        if (countElement) {
            countElement.textContent = `${count} project${count !== 1 ? 's' : ''}`;
        }
    }

    /**
     * Attach event listeners to filter buttons
     */
    attachEventListeners() {
        const buttons = this.shadowRoot.querySelectorAll('.filter-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tech = btn.dataset.tech;
                if (tech === 'all') {
                    this.showAllProjects();
                } else {
                    this.filterProjects(tech);
                }
            });
        });
    }

    render() {
        const sortedTechs = Array.from(this.technologies).sort();
        const projectItems = document.querySelectorAll('project-item');
        const totalCount = projectItems.length;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    margin-bottom: 2rem;
                }

                .filter-container {
                    background: rgba(31, 41, 55, 0.5);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(99, 102, 241, 0.2);
                    border-radius: 1rem;
                    padding: 1.5rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }

                [data-theme="light"] .filter-container {
                    background: rgba(255, 255, 255, 0.8);
                    border-color: rgba(79, 70, 229, 0.3);
                }

                .filter-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .filter-title {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: #f3f4f6;
                    margin: 0;
                }

                [data-theme="light"] .filter-title {
                    color: #111827;
                }

                .project-count {
                    font-size: 0.875rem;
                    color: #9ca3af;
                    font-weight: 500;
                }

                [data-theme="light"] .project-count {
                    color: #6b7280;
                }

                .filter-buttons {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .filter-btn {
                    padding: 0.5rem 1rem;
                    border: 1px solid rgba(99, 102, 241, 0.3);
                    background: rgba(99, 102, 241, 0.1);
                    color: #a5b4fc;
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 300ms ease;
                    outline: none;
                }

                [data-theme="light"] .filter-btn {
                    border-color: rgba(79, 70, 229, 0.3);
                    background: rgba(79, 70, 229, 0.1);
                    color: #6366f1;
                }

                .filter-btn:hover {
                    background: rgba(99, 102, 241, 0.2);
                    border-color: rgba(99, 102, 241, 0.5);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(99, 102, 241, 0.2);
                }

                [data-theme="light"] .filter-btn:hover {
                    background: rgba(79, 70, 229, 0.2);
                    border-color: rgba(79, 70, 229, 0.5);
                    box-shadow: 0 4px 8px rgba(79, 70, 229, 0.2);
                }

                .filter-btn:focus-visible {
                    outline: 2px solid #818cf8;
                    outline-offset: 2px;
                }

                .filter-btn.active {
                    background: linear-gradient(135deg, #6366f1 0%, #a78bfa 100%);
                    border-color: #6366f1;
                    color: #ffffff;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
                }

                [data-theme="light"] .filter-btn.active {
                    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                    border-color: #4f46e5;
                    color: #ffffff;
                    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
                }

                .filter-btn.active:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(99, 102, 241, 0.5);
                }

                .no-results {
                    display: none;
                    text-align: center;
                    padding: 2rem;
                    color: #9ca3af;
                    font-size: 1rem;
                }

                [data-theme="light"] .no-results {
                    color: #6b7280;
                }

                .no-results.visible {
                    display: block;
                }
            </style>

            <div class="filter-container">
                <div class="filter-header">
                    <h3 class="filter-title">Filter by Technology</h3>
                    <span class="project-count">${totalCount} project${totalCount !== 1 ? 's' : ''}</span>
                </div>
                <div class="filter-buttons">
                    <button class="filter-btn active" data-tech="all">All</button>
                    ${sortedTechs.map(tech => `
                        <button class="filter-btn" data-tech="${tech}">${tech}</button>
                    `).join('')}
                </div>
            </div>
            <div class="no-results">
                <p>No projects found with this technology.</p>
            </div>
        `;
    }
}

customElements.define('project-filter', ProjectFilter);
