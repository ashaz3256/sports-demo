/**
 * Analytics Service - Handles user analytics and tracking
 * 
 * This service demonstrates analytics capabilities including
 * user behavior tracking, event analytics, and data visualization.
 * 
 * @author Lumara Team
 * @version 1.0.0
 */

class AnalyticsService {
    constructor() {
        this.events = [];
        this.userSessions = new Map();
        this.pageViews = [];
        this.customMetrics = new Map();
        
        this.sessionId = this.generateSessionId();
        this.userId = this.getUserId();
        
        this.init();
    }

    /**
     * Initialize analytics service
     */
    init() {
        this.trackPageView();
        this.setupEventListeners();
        this.startSessionTracking();
    }

    /**
     * Generate unique session ID
     * @returns {string} Session ID
     */
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Get or create user ID
     * @returns {string} User ID
     */
    getUserId() {
        let userId = localStorage.getItem('lumara_sports_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('lumara_sports_user_id', userId);
        }
        return userId;
    }

    /**
     * Track page view
     * @param {string} page - Page name
     */
    trackPageView(page = window.location.pathname) {
        const pageView = {
            sessionId: this.sessionId,
            userId: this.userId,
            page,
            timestamp: new Date().toISOString(),
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };

        this.pageViews.push(pageView);
        this.events.push({
            type: 'page_view',
            data: pageView
        });

        console.log('Page view tracked:', pageView);
    }

    /**
     * Track custom event
     * @param {string} eventType - Event type
     * @param {Object} eventData - Event data
     */
    trackEvent(eventType, eventData = {}) {
        const event = {
            sessionId: this.sessionId,
            userId: this.userId,
            type: eventType,
            data: eventData,
            timestamp: new Date().toISOString(),
            page: window.location.pathname
        };

        this.events.push(event);
        console.log('Event tracked:', event);
    }

    /**
     * Set up event listeners for automatic tracking
     */
    setupEventListeners() {
        // Track clicks on important elements
        document.addEventListener('click', (event) => {
            const element = event.target;
            
            // Track button clicks
            if (element.tagName === 'BUTTON' || element.classList.contains('btn')) {
                this.trackEvent('button_click', {
                    element: element.textContent.trim(),
                    className: element.className,
                    id: element.id
                });
            }

            // Track link clicks
            if (element.tagName === 'A') {
                this.trackEvent('link_click', {
                    href: element.href,
                    text: element.textContent.trim()
                });
            }

            // Track tab switches
            if (element.classList.contains('nav-tab')) {
                this.trackEvent('tab_switch', {
                    tab: element.dataset.tab
                });
            }
        });

        // Track form interactions
        document.addEventListener('submit', (event) => {
            this.trackEvent('form_submit', {
                formId: event.target.id,
                formClass: event.target.className
            });
        });

        // Track scroll depth
        let maxScrollDepth = 0;
        window.addEventListener('scroll', () => {
            const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;
                this.trackEvent('scroll_depth', {
                    depth: scrollDepth
                });
            }
        });

        // Track time on page
        this.trackTimeOnPage();
    }

    /**
     * Track time spent on page
     */
    trackTimeOnPage() {
        const startTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Date.now() - startTime;
            this.trackEvent('time_on_page', {
                duration: timeOnPage,
                durationSeconds: Math.round(timeOnPage / 1000)
            });
        });
    }

    /**
     * Start session tracking
     */
    startSessionTracking() {
        const session = {
            sessionId: this.sessionId,
            userId: this.userId,
            startTime: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            pageViews: 0,
            events: 0,
            device: this.getDeviceInfo(),
            location: this.getLocationInfo()
        };

        this.userSessions.set(this.sessionId, session);

        // Update session activity every 30 seconds
        setInterval(() => {
            this.updateSessionActivity();
        }, 30000);
    }

    /**
     * Update session activity
     */
    updateSessionActivity() {
        const session = this.userSessions.get(this.sessionId);
        if (session) {
            session.lastActivity = new Date().toISOString();
            session.events = this.events.filter(e => e.sessionId === this.sessionId).length;
            session.pageViews = this.pageViews.filter(p => p.sessionId === this.sessionId).length;
        }
    }

    /**
     * Get device information
     * @returns {Object} Device info
     */
    getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            screen: {
                width: screen.width,
                height: screen.height,
                colorDepth: screen.colorDepth
            }
        };
    }

    /**
     * Get location information (mock implementation)
     * @returns {Object} Location info
     */
    getLocationInfo() {
        // In a real application, you would use a geolocation service
        return {
            country: 'UK',
            region: 'England',
            city: 'London',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }

    /**
     * Get analytics data for charts
     * @param {string} startDate - Start date
     * @param {string} endDate - End date
     * @returns {Promise<Object>} Analytics data
     */
    async getAnalyticsData(startDate, endDate) {
        try {
            // In a real application, this would fetch from an analytics API
            return this.generateMockAnalyticsData(startDate, endDate);
        } catch (error) {
            console.error('Error fetching analytics data:', error);
            throw error;
        }
    }

    /**
     * Generate mock analytics data
     * @param {string} startDate - Start date
     * @param {string} endDate - End date
     * @returns {Object} Mock analytics data
     */
    generateMockAnalyticsData(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        return {
            engagement: {
                labels: this.generateDateLabels(days),
                pageViews: this.generateRandomData(days, 1000, 5000),
                uniqueVisitors: this.generateRandomData(days, 500, 2000)
            },
            content: {
                labels: ['Football', 'Cricket', 'Tennis', 'Rugby', 'Golf'],
                views: this.generateRandomData(5, 100, 1000)
            },
            devices: {
                labels: ['Desktop', 'Mobile', 'Tablet'],
                values: [45, 40, 15]
            },
            geography: {
                labels: ['UK', 'US', 'Australia', 'India', 'Germany'],
                values: this.generateRandomData(5, 100, 1000)
            }
        };
    }

    /**
     * Generate date labels for charts
     * @param {number} days - Number of days
     * @returns {Array} Date labels
     */
    generateDateLabels(days) {
        const labels = [];
        const today = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
            labels.push(date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' }));
        }
        
        return labels;
    }

    /**
     * Generate random data for charts
     * @param {number} count - Number of data points
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {Array} Random data
     */
    generateRandomData(count, min, max) {
        const data = [];
        for (let i = 0; i < count; i++) {
            data.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }
        return data;
    }

    /**
     * Get user engagement metrics
     * @returns {Object} Engagement metrics
     */
    getEngagementMetrics() {
        const totalPageViews = this.pageViews.length;
        const totalEvents = this.events.length;
        const uniqueUsers = new Set(this.pageViews.map(p => p.userId)).size;
        const averageTimeOnPage = this.calculateAverageTimeOnPage();

        return {
            totalPageViews,
            totalEvents,
            uniqueUsers,
            averageTimeOnPage,
            bounceRate: this.calculateBounceRate(),
            topPages: this.getTopPages(),
            topEvents: this.getTopEvents()
        };
    }

    /**
     * Calculate average time on page
     * @returns {number} Average time in seconds
     */
    calculateAverageTimeOnPage() {
        const timeEvents = this.events.filter(e => e.type === 'time_on_page');
        if (timeEvents.length === 0) return 0;
        
        const totalTime = timeEvents.reduce((sum, event) => sum + event.data.durationSeconds, 0);
        return Math.round(totalTime / timeEvents.length);
    }

    /**
     * Calculate bounce rate
     * @returns {number} Bounce rate percentage
     */
    calculateBounceRate() {
        const singlePageSessions = Array.from(this.userSessions.values())
            .filter(session => session.pageViews === 1).length;
        const totalSessions = this.userSessions.size;
        
        return totalSessions > 0 ? Math.round((singlePageSessions / totalSessions) * 100) : 0;
    }

    /**
     * Get top pages by views
     * @returns {Array} Top pages
     */
    getTopPages() {
        const pageCounts = {};
        this.pageViews.forEach(pageView => {
            pageCounts[pageView.page] = (pageCounts[pageView.page] || 0) + 1;
        });

        return Object.entries(pageCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([page, count]) => ({ page, count }));
    }

    /**
     * Get top events by frequency
     * @returns {Array} Top events
     */
    getTopEvents() {
        const eventCounts = {};
        this.events.forEach(event => {
            eventCounts[event.type] = (eventCounts[event.type] || 0) + 1;
        });

        return Object.entries(eventCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([type, count]) => ({ type, count }));
    }

    /**
     * Export analytics data
     * @returns {Object} Exported analytics data
     */
    exportData() {
        return {
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            userId: this.userId,
            events: this.events,
            pageViews: this.pageViews,
            userSessions: Array.from(this.userSessions.entries()),
            engagementMetrics: this.getEngagementMetrics()
        };
    }

    /**
     * Clear analytics data
     */
    clearData() {
        this.events = [];
        this.pageViews = [];
        this.userSessions.clear();
        this.customMetrics.clear();
    }
}
