/**
 * Performance Monitor - Tracks application performance metrics
 * 
 * This service demonstrates performance monitoring capabilities
 * including page load times, API response times, and user analytics.
 * 
 * @author Lumara Team
 * @version 1.0.0
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            pageLoadTime: null,
            apiResponseTime: null,
            activeUsers: 0,
            errorRate: 0,
            memoryUsage: null,
            renderTime: null
        };
        
        this.performanceObserver = null;
        this.userActivity = new Map();
        this.errorCount = 0;
        this.totalRequests = 0;
        
        this.init();
    }

    /**
     * Initialize performance monitoring
     */
    init() {
        this.setupPerformanceObserver();
        this.trackUserActivity();
        this.trackErrors();
        this.trackMemoryUsage();
        this.startMetricsCollection();
    }

    /**
     * Set up Performance Observer for detailed metrics
     */
    setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            try {
                this.performanceObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        this.processPerformanceEntry(entry);
                    });
                });

                // Observe different types of performance entries
                this.performanceObserver.observe({ entryTypes: ['navigation', 'paint', 'measure'] });
            } catch (error) {
                console.warn('Performance Observer not supported:', error);
            }
        }
    }

    /**
     * Process performance entries
     * @param {PerformanceEntry} entry - Performance entry
     */
    processPerformanceEntry(entry) {
        switch (entry.entryType) {
            case 'navigation':
                this.processNavigationEntry(entry);
                break;
            case 'paint':
                this.processPaintEntry(entry);
                break;
            case 'measure':
                this.processMeasureEntry(entry);
                break;
        }
    }

    /**
     * Process navigation performance entry
     * @param {PerformanceNavigationTiming} entry - Navigation entry
     */
    processNavigationEntry(entry) {
        this.metrics.pageLoadTime = Math.round(entry.loadEventEnd - entry.loadEventStart);
        this.metrics.renderTime = Math.round(entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart);
        
        // Log performance metrics
        console.log('Performance Metrics:', {
            pageLoadTime: this.metrics.pageLoadTime,
            renderTime: this.metrics.renderTime,
            domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
            firstPaint: this.getFirstPaintTime()
        });
    }

    /**
     * Process paint performance entry
     * @param {PerformancePaintTiming} entry - Paint entry
     */
    processPaintEntry(entry) {
        if (entry.name === 'first-contentful-paint') {
            this.metrics.firstContentfulPaint = Math.round(entry.startTime);
        }
    }

    /**
     * Process measure performance entry
     * @param {PerformanceMeasure} entry - Measure entry
     */
    processMeasureEntry(entry) {
        // Track custom performance measures
        if (entry.name.includes('api-call')) {
            this.updateApiResponseTime(entry.duration);
        }
    }

    /**
     * Get first paint time
     * @returns {number} First paint time in milliseconds
     */
    getFirstPaintTime() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? Math.round(firstPaint.startTime) : null;
    }

    /**
     * Track user activity
     */
    trackUserActivity() {
        // Track page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.recordUserActivity('page_visible');
            } else {
                this.recordUserActivity('page_hidden');
            }
        });

        // Track user interactions
        ['click', 'scroll', 'keydown', 'mousemove'].forEach(eventType => {
            document.addEventListener(eventType, () => {
                this.recordUserActivity(eventType);
            }, { passive: true });
        });

        // Track page unload
        window.addEventListener('beforeunload', () => {
            this.recordUserActivity('page_unload');
        });
    }

    /**
     * Record user activity
     * @param {string} action - User action
     */
    recordUserActivity(action) {
        const timestamp = Date.now();
        const sessionId = this.getSessionId();
        
        if (!this.userActivity.has(sessionId)) {
            this.userActivity.set(sessionId, {
                startTime: timestamp,
                lastActivity: timestamp,
                actions: []
            });
        }

        const session = this.userActivity.get(sessionId);
        session.lastActivity = timestamp;
        session.actions.push({ action, timestamp });

        // Update active users count
        this.updateActiveUsersCount();
    }

    /**
     * Get or create session ID
     * @returns {string} Session ID
     */
    getSessionId() {
        let sessionId = sessionStorage.getItem('lumara_sports_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('lumara_sports_session_id', sessionId);
        }
        return sessionId;
    }

    /**
     * Update active users count
     */
    updateActiveUsersCount() {
        const now = Date.now();
        const activeThreshold = 5 * 60 * 1000; // 5 minutes
        
        let activeCount = 0;
        this.userActivity.forEach(session => {
            if (now - session.lastActivity < activeThreshold) {
                activeCount++;
            }
        });
        
        this.metrics.activeUsers = activeCount;
    }

    /**
     * Track errors
     */
    trackErrors() {
        // Track JavaScript errors
        window.addEventListener('error', (event) => {
            this.recordError('javascript_error', event.error);
        });

        // Track unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.recordError('unhandled_rejection', event.reason);
        });

        // Track fetch errors
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            this.totalRequests++;
            try {
                const response = await originalFetch(...args);
                if (!response.ok) {
                    this.recordError('api_error', `HTTP ${response.status}: ${response.statusText}`);
                }
                return response;
            } catch (error) {
                this.recordError('fetch_error', error.message);
                throw error;
            }
        };
    }

    /**
     * Record an error
     * @param {string} type - Error type
     * @param {string|Error} error - Error details
     */
    recordError(type, error) {
        this.errorCount++;
        this.updateErrorRate();
        
        console.error(`Performance Monitor - ${type}:`, error);
        
        // In a real application, you would send this to an error tracking service
        this.sendErrorToAnalytics(type, error);
    }

    /**
     * Update error rate
     */
    updateErrorRate() {
        if (this.totalRequests > 0) {
            this.metrics.errorRate = Math.round((this.errorCount / this.totalRequests) * 100 * 100) / 100;
        }
    }

    /**
     * Send error to analytics (mock implementation)
     * @param {string} type - Error type
     * @param {string|Error} error - Error details
     */
    sendErrorToAnalytics(type, error) {
        // In a real application, this would send to an analytics service
        console.log('Sending error to analytics:', { type, error: error.toString() });
    }

    /**
     * Track memory usage
     */
    trackMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                this.metrics.memoryUsage = {
                    used: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
                    total: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
                    limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) // MB
                };
            }, 10000); // Check every 10 seconds
        }
    }

    /**
     * Start metrics collection
     */
    startMetricsCollection() {
        // Update metrics every 30 seconds
        setInterval(() => {
            this.updateActiveUsersCount();
            this.updateErrorRate();
        }, 30000);

        // Clean up old user sessions every 5 minutes
        setInterval(() => {
            this.cleanupOldSessions();
        }, 300000);
    }

    /**
     * Clean up old user sessions
     */
    cleanupOldSessions() {
        const now = Date.now();
        const sessionTimeout = 30 * 60 * 1000; // 30 minutes
        
        this.userActivity.forEach((session, sessionId) => {
            if (now - session.lastActivity > sessionTimeout) {
                this.userActivity.delete(sessionId);
            }
        });
    }

    /**
     * Record page load time
     */
    recordPageLoad() {
        if (performance.timing) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            this.metrics.pageLoadTime = loadTime;
        }
    }

    /**
     * Record resize event
     */
    recordResize() {
        this.recordUserActivity('window_resize');
    }

    /**
     * Update API response time
     * @param {number} duration - Response time in milliseconds
     */
    updateApiResponseTime(duration) {
        if (!this.metrics.apiResponseTime) {
            this.metrics.apiResponseTime = duration;
        } else {
            // Calculate rolling average
            this.metrics.apiResponseTime = Math.round((this.metrics.apiResponseTime + duration) / 2);
        }
    }

    /**
     * Get current metrics
     * @returns {Object} Current performance metrics
     */
    getMetrics() {
        return { ...this.metrics };
    }

    /**
     * Get detailed performance report
     * @returns {Object} Detailed performance report
     */
    getPerformanceReport() {
        return {
            metrics: this.getMetrics(),
            userActivity: {
                totalSessions: this.userActivity.size,
                activeSessions: Array.from(this.userActivity.values()).filter(
                    session => Date.now() - session.lastActivity < 5 * 60 * 1000
                ).length
            },
            errors: {
                totalErrors: this.errorCount,
                errorRate: this.metrics.errorRate,
                totalRequests: this.totalRequests
            },
            performance: {
                firstPaint: this.getFirstPaintTime(),
                firstContentfulPaint: this.metrics.firstContentfulPaint,
                renderTime: this.metrics.renderTime
            }
        };
    }

    /**
     * Export performance data
     * @returns {Object} Exported performance data
     */
    exportData() {
        return {
            timestamp: new Date().toISOString(),
            report: this.getPerformanceReport(),
            userSessions: Array.from(this.userActivity.entries())
        };
    }

    /**
     * Destroy performance monitor
     */
    destroy() {
        if (this.performanceObserver) {
            this.performanceObserver.disconnect();
        }
        
        this.userActivity.clear();
    }
}
