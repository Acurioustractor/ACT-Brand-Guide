// ACT Brand Guide - Main JavaScript

// Global configuration
const CONFIG = {
    API_BASE: window.location.origin,
    ANIMATION_DURATION: 300,
    COPY_FEEDBACK_DURATION: 3000
};

// Utility functions
const utils = {
    // Smooth scroll to element
    scrollTo(element, offset = 80) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        if (element) {
            const targetPosition = element.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    },

    // Show feedback message
    showFeedback(message, type = 'success') {
        let feedback = document.getElementById('feedback-toast');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.id = 'feedback-toast';
            feedback.className = 'copy-feedback';
            document.body.appendChild(feedback);
        }
        
        feedback.textContent = message;
        feedback.classList.add('show');
        
        setTimeout(() => {
            feedback.classList.remove('show');
        }, CONFIG.COPY_FEEDBACK_DURATION);
    },

    // Format date
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-AU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// API functions
const api = {
    // Fetch projects
    async getProjects() {
        try {
            const response = await fetch(`${CONFIG.API_BASE}/projects.json`);
            if (!response.ok) throw new Error('Failed to fetch projects');
            return await response.json();
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw error;
        }
    },

    // Submit project idea
    async submitIdea(formData) {
        try {
            const response = await fetch(`${CONFIG.API_BASE}/api/submit-idea`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) throw new Error('Failed to submit idea');
            return await response.json();
        } catch (error) {
            console.error('Error submitting idea:', error);
            throw error;
        }
    },

    // Check API health
    async checkHealth() {
        try {
            const response = await fetch(`${CONFIG.API_BASE}/health.json`);
            if (!response.ok) throw new Error('Health check failed');
            return await response.json();
        } catch (error) {
            console.error('Health check failed:', error);
            return { status: 'error', notion_connected: false };
        }
    }
};

// Navigation functionality
const navigation = {
    init() {
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupActiveStates();
    },

    setupMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (toggle && navLinks) {
            toggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                toggle.classList.toggle('active');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
                    navLinks.classList.remove('active');
                    toggle.classList.remove('active');
                }
            });
        }
    },

    setupSmoothScroll() {
        // Handle anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    utils.scrollTo(target);
                }
            });
        });
    },

    setupActiveStates() {
        // Highlight current page in navigation
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            if (linkPath === currentPath || (currentPath === '/' && linkPath === '/')) {
                link.classList.add('active');
            }
        });
    }
};

// Color palette functionality
const colorPalette = {
    init() {
        this.setupColorCopying();
    },

    setupColorCopying() {
        document.querySelectorAll('.color-card').forEach(card => {
            card.addEventListener('click', () => {
                const hex = card.querySelector('.color-hex')?.textContent;
                const name = card.querySelector('.color-name')?.textContent;
                
                if (hex && name) {
                    this.copyColor(hex, name);
                }
            });
        });
    },

    async copyColor(hex, name) {
        try {
            await navigator.clipboard.writeText(hex);
            utils.showFeedback(`${name} (${hex}) copied!`);
        } catch (error) {
            console.error('Failed to copy color:', error);
            utils.showFeedback(`Failed to copy ${name}`, 'error');
        }
    }
};

// Project functionality
const projects = {
    init() {
        this.setupProjectInteractions();
    },

    setupProjectInteractions() {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking on a link
                if (e.target.tagName === 'A') return;
                
                const projectId = card.dataset.projectId;
                if (projectId) {
                    this.openProject(projectId);
                }
            });
        });
    },

    openProject(projectId) {
        // This could be expanded to show a modal or navigate to project detail page
        console.log('Opening project:', projectId);
        // For now, just log - could be expanded later
    },

    async loadProjects(container) {
        if (!container) return;
        
        try {
            container.innerHTML = `
                <div class="text-center p-xl">
                    <div class="loading"></div>
                    <p class="mt-md">Loading projects...</p>
                </div>
            `;

            const data = await api.getProjects();
            this.renderProjects(container, data.projects);
            
            // Update footer with connection status
            this.updateConnectionStatus(data.source);
        } catch (error) {
            container.innerHTML = `
                <div class="text-center p-xl">
                    <div style="font-size: 3em; margin-bottom: 20px;">⚠️</div>
                    <h3>Unable to Load Projects</h3>
                    <p style="color: #666; margin-top: 10px;">Please try again later or contact us directly.</p>
                </div>
            `;
        }
    },

    renderProjects(container, projects) {
        if (!projects || projects.length === 0) {
            container.innerHTML = `
                <div class="text-center p-xl">
                    <div style="font-size: 3em; margin-bottom: 20px; color: var(--act-seedling);">◆</div>
                    <h3>Seeds Are Germinating</h3>
                    <p style="color: #666; margin-top: 10px;">New projects are in development. Check back soon!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = projects.map(project => `
            <div class="project-card" data-project-id="${project.id}">
                <div class="project-image" style="background: ${this.getProjectGradient(project.emoji)}">
                    <span>${project.emoji}</span>
                    <div class="project-status">${project.status}</div>
                </div>
                <div class="project-info">
                    <div class="project-title">${project.name}</div>
                    <div class="project-description">${project.description}</div>
                    ${project.impact ? `
                    <div class="project-impact">
                        <strong>Impact:</strong> ${project.impact}
                    </div>` : ''}
                    ${project.location || project.partner ? `
                    <div class="mb-md" style="color: #666; font-size: 0.9em;">
                        ${project.location ? `<span style="color: var(--act-soil);">◯</span> ${project.location}` : ''}
                        ${project.partner ? ` • <span style="color: var(--act-empathy);">◐</span> ${project.partner}` : ''}
                    </div>` : ''}
                    ${project.tags && project.tags.length > 0 ? `
                    <div class="mb-md">
                        ${project.tags.map(tag => 
                            `<span style="background: var(--act-cream); color: var(--act-soil); padding: 4px 8px; border-radius: 12px; font-size: 0.8em; margin-right: 8px; margin-bottom: 4px; display: inline-block;">${tag}</span>`
                        ).join('')}
                    </div>` : ''}
                    <div class="project-links">
                        ${project.links ? project.links.map(link => 
                            `<a href="${link.url}" class="project-link ${link.type || 'primary'}" onclick="event.stopPropagation()" ${link.url.startsWith('http') ? 'target="_blank"' : ''}>${link.text}</a>`
                        ).join('') : `<a href="${project.website}" class="project-link primary" onclick="event.stopPropagation()" ${project.website && project.website.startsWith('http') ? 'target="_blank"' : ''}>Learn More</a>`}
                    </div>
                </div>
            </div>
        `).join('');
    },

    getProjectGradient(emoji) {
        // Map emojis to color gradients
        const gradientMap = {
            '◎': 'linear-gradient(135deg, var(--act-empathy), #c2185b)',
            '◯': 'linear-gradient(135deg, var(--act-seedling), #689f38)',
            '⬢': 'linear-gradient(135deg, var(--act-sunrise), #f4511e)',
            '◊': 'linear-gradient(135deg, var(--act-justice), #303f9f)',
            '◆': 'linear-gradient(135deg, var(--act-seedling), var(--act-soil))',
            '◐': 'linear-gradient(135deg, var(--act-resilience), #00695c)',
            '◈': 'linear-gradient(135deg, var(--act-innovation), #7b1fa2)',
            '→': 'linear-gradient(135deg, var(--act-autumn), #bf360c)'
        };
        
        return gradientMap[emoji] || 'linear-gradient(135deg, var(--act-seedling), var(--act-soil))';
    },

    updateConnectionStatus(source) {
        const statusElement = document.getElementById('connection-status');
        if (!statusElement) return;

        let statusHTML = '';
        if (source === 'notion') {
            statusHTML = `
                <div style="margin-top: 20px; padding: 15px; background: rgba(124, 179, 66, 0.1); border-radius: 8px; font-size: 0.9em;">
                    🔗 Connected to live project data via Notion
                </div>
            `;
        } else if (source === 'sample' || source === 'sample_fallback') {
            statusHTML = `
                <div style="margin-top: 20px; padding: 15px; background: rgba(255, 107, 53, 0.1); border-radius: 8px; font-size: 0.9em;">
                    📋 Displaying sample project data (Notion not configured)
                </div>
            `;
        }
        
        statusElement.innerHTML = statusHTML;
    }
};

// Form handling
const forms = {
    init() {
        this.setupIdeaSubmission();
    },

    setupIdeaSubmission() {
        const form = document.getElementById('idea-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleIdeaSubmission(form);
        });
    },

    async handleIdeaSubmission(form) {
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            project: formData.get('project'),
            description: formData.get('description')
        };

        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        try {
            submitButton.disabled = true;
            submitButton.innerHTML = '<div class="loading"></div> Submitting...';

            const result = await api.submitIdea(data);
            
            if (result.success) {
                utils.showFeedback(result.message || 'Idea submitted successfully!');
                form.reset();
            } else {
                throw new Error(result.error || 'Submission failed');
            }
        } catch (error) {
            utils.showFeedback(error.message || 'Failed to submit idea. Please try again.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }
};

// Intersection Observer for animations
const animations = {
    init() {
        this.setupScrollAnimations();
    },

    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe sections for scroll animations
        document.querySelectorAll('section, .card, .project-card').forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }
};

// Logo management
const logoManager = {
    init() {
        // Skip logo management on GitHub Pages since templates now have correct basePath
        const isGitHubPages = window.location.hostname.includes('github.io');
        if (isGitHubPages) {
            console.log('Logo manager - skipping on GitHub Pages, templates handle basePath');
            return;
        }
        this.updateLogos();
    },

    updateLogos() {
        // Only runs for local development now
        const logoURL = '/logo/act-logo-horizontal.png';
        
        console.log('Logo manager - updating for local development');
        
        // Update all logo images
        document.querySelectorAll('img[src*="logo"]').forEach(img => {
            if (img.alt && (img.alt.includes('ACT') || img.alt.includes('Curious Tractor'))) {
                console.log('Logo manager - updating image:', img.src, 'to:', logoURL);
                this.loadLogo(img, logoURL);
            }
        });
    },

    loadLogo(imgElement, logoURL) {
        console.log('Loading logo:', logoURL);
        const testImage = new Image();
        testImage.onload = () => {
            console.log('Logo loaded successfully:', logoURL);
            imgElement.src = logoURL;
            imgElement.style.display = 'block';
            const fallback = imgElement.nextElementSibling;
            if (fallback && fallback.style) {
                fallback.style.display = 'none';
            }
        };
        testImage.onerror = () => {
            // Keep existing fallback if logo file not found
            console.log('Logo file not found, using fallback:', logoURL);
            imgElement.style.display = 'none';
            const fallback = imgElement.nextElementSibling;
            if (fallback && fallback.style) {
                fallback.style.display = 'flex';
            }
        };
        testImage.src = logoURL;
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    navigation.init();
    colorPalette.init();
    projects.init();
    forms.init();
    animations.init();
    logoManager.init();

    // Check API health on load
    api.checkHealth().then(health => {
        console.log('API Health:', health);
    });

    // Add keyboard accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close any open modals or menus
            document.querySelectorAll('.active').forEach(el => {
                el.classList.remove('active');
            });
        }
    });
});

// Expose utilities for use in page-specific scripts
window.ACT = {
    utils,
    api,
    projects,
    logoManager
}; 