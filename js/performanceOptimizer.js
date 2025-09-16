/**
 * Performance Optimizer - Handles performance optimizations
 * 
 * This service demonstrates performance optimization techniques
 * including lazy loading, caching, and smooth animations.
 * 
 * @author Lumara Team
 * @version 1.0.0
 */

class PerformanceOptimizer {
    constructor() {
        this.intersectionObserver = null;
        this.animationFrameId = null;
        this.debounceTimers = new Map();
        this.throttleTimers = new Map();
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        
        this.init();
    }

    /**
     * Initialize performance optimizer
     */
    init() {
        this.setupIntersectionObserver();
        this.setupPerformanceMonitoring();
        this.setupLazyLoading();
        this.setupSmoothAnimations();
    }

    /**
     * Setup intersection observer for lazy loading
     */
    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            this.intersectionObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.handleIntersection(entry);
                        }
                    });
                },
                {
                    rootMargin: '50px',
                    threshold: 0.1
                }
            );
        }
    }

    /**
     * Handle intersection observer callback
     * @param {IntersectionObserverEntry} entry - Intersection entry
     */
    handleIntersection(entry) {
        const element = entry.target;
        
        if (element.dataset.lazyLoad) {
            this.loadLazyContent(element);
        }
        
        if (element.dataset.animateOnScroll) {
            this.animateOnScroll(element);
        }
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        // Monitor performance metrics
        if ('performance' in window) {
            this.monitorPerformance();
        }

        // Monitor memory usage
        if ('memory' in performance) {
            this.monitorMemoryUsage();
        }

        // Monitor network performance
        this.monitorNetworkPerformance();
    }

    /**
     * Monitor performance metrics
     */
    monitorPerformance() {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                if (entry.entryType === 'measure') {
                    this.logPerformanceMetric(entry);
                }
            });
        });

        observer.observe({ entryTypes: ['measure'] });
    }

    /**
     * Monitor memory usage
     */
    monitorMemoryUsage() {
        setInterval(() => {
            if (performance.memory) {
                const memory = performance.memory;
                const memoryUsage = {
                    used: memory.usedJSHeapSize,
                    total: memory.totalJSHeapSize,
                    limit: memory.jsHeapSizeLimit
                };
                
                if (memoryUsage.used / memoryUsage.limit > 0.8) {
                    this.triggerMemoryCleanup();
                }
            }
        }, 30000);
    }

    /**
     * Monitor network performance
     */
    monitorNetworkPerformance() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            connection.addEventListener('change', () => {
                this.adaptToNetworkConditions(connection);
            });
        }
    }

    /**
     * Setup lazy loading
     */
    setupLazyLoading() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            this.intersectionObserver?.observe(img);
        });

        // Lazy load charts
        const charts = document.querySelectorAll('canvas[data-lazy-chart]');
        charts.forEach(chart => {
            this.intersectionObserver?.observe(chart);
        });
    }

    /**
     * Setup smooth animations
     */
    setupSmoothAnimations() {
        // Use requestAnimationFrame for smooth animations
        this.animateElements();
    }

    /**
     * Load lazy content
     * @param {HTMLElement} element - Element to load
     */
    loadLazyContent(element) {
        if (element.dataset.lazyLoad === 'image') {
            this.loadLazyImage(element);
        } else if (element.dataset.lazyLoad === 'chart') {
            this.loadLazyChart(element);
        }
    }

    /**
     * Load lazy image
     * @param {HTMLImageElement} img - Image element
     */
    loadLazyImage(img) {
        const src = img.dataset.src;
        if (src) {
            img.src = src;
            img.classList.add('loaded');
            this.intersectionObserver?.unobserve(img);
        }
    }

    /**
     * Load lazy chart
     * @param {HTMLCanvasElement} canvas - Canvas element
     */
    loadLazyChart(canvas) {
        const chartType = canvas.dataset.chartType;
        if (chartType) {
            // Trigger chart creation
            this.dispatchEvent('lazyChartLoad', { canvas, chartType });
            this.intersectionObserver?.unobserve(canvas);
        }
    }

    /**
     * Animate element on scroll
     * @param {HTMLElement} element - Element to animate
     */
    animateOnScroll(element) {
        element.classList.add('animate-in');
        this.intersectionObserver?.unobserve(element);
    }

    /**
     * Animate elements
     */
    animateElements() {
        this.animationFrameId = requestAnimationFrame(() => {
            this.animateElements();
        });

        // Animate elements with animation classes
        const animatedElements = document.querySelectorAll('.animate-in');
        animatedElements.forEach(element => {
            this.animateElement(element);
        });
    }

    /**
     * Animate single element
     * @param {HTMLElement} element - Element to animate
     */
    animateElement(element) {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !element.classList.contains('animated')) {
            element.classList.add('animated');
            this.addAnimationClass(element);
        }
    }

    /**
     * Add animation class to element
     * @param {HTMLElement} element - Element to animate
     */
    addAnimationClass(element) {
        const animationType = element.dataset.animationType || 'fade-in';
        element.classList.add(animationType);
    }

    /**
     * Debounce function
     * @param {Function} func - Function to debounce
     * @param {number} delay - Delay in milliseconds
     * @param {string} key - Unique key for the debounce
     * @returns {Function} Debounced function
     */
    debounce(func, delay, key) {
        return (...args) => {
            if (this.debounceTimers.has(key)) {
                clearTimeout(this.debounceTimers.get(key));
            }
            
            const timer = setTimeout(() => {
                func.apply(this, args);
                this.debounceTimers.delete(key);
            }, delay);
            
            this.debounceTimers.set(key, timer);
        };
    }

    /**
     * Throttle function
     * @param {Function} func - Function to throttle
     * @param {number} delay - Delay in milliseconds
     * @param {string} key - Unique key for the throttle
     * @returns {Function} Throttled function
     */
    throttle(func, delay, key) {
        return (...args) => {
            if (this.throttleTimers.has(key)) {
                return;
            }
            
            func.apply(this, args);
            
            const timer = setTimeout(() => {
                this.throttleTimers.delete(key);
            }, delay);
            
            this.throttleTimers.set(key, timer);
        };
    }

    /**
     * Cache data
     * @param {string} key - Cache key
     * @param {*} data - Data to cache
     * @param {number} timeout - Timeout in milliseconds
     */
    cacheData(key, data, timeout = this.cacheTimeout) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            timeout
        });
    }

    /**
     * Get cached data
     * @param {string} key - Cache key
     * @returns {*} Cached data or null
     */
    getCachedData(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < cached.timeout) {
            return cached.data;
        }
        
        this.cache.delete(key);
        return null;
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Trigger memory cleanup
     */
    triggerMemoryCleanup() {
        // Clear old cache entries
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > value.timeout) {
                this.cache.delete(key);
            }
        }

        // Clear debounce timers
        this.debounceTimers.clear();

        // Clear throttle timers
        this.throttleTimers.clear();

        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
    }

    /**
     * Adapt to network conditions
     * @param {NetworkInformation} connection - Network connection info
     */
    adaptToNetworkConditions(connection) {
        const effectiveType = connection.effectiveType;
        
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
            this.enableLowBandwidthMode();
        } else if (effectiveType === '3g') {
            this.enableMediumBandwidthMode();
        } else {
            this.enableHighBandwidthMode();
        }
    }

    /**
     * Enable low bandwidth mode
     */
    enableLowBandwidthMode() {
        document.body.classList.add('low-bandwidth');
        this.dispatchEvent('bandwidthModeChanged', { mode: 'low' });
    }

    /**
     * Enable medium bandwidth mode
     */
    enableMediumBandwidthMode() {
        document.body.classList.add('medium-bandwidth');
        this.dispatchEvent('bandwidthModeChanged', { mode: 'medium' });
    }

    /**
     * Enable high bandwidth mode
     */
    enableHighBandwidthMode() {
        document.body.classList.remove('low-bandwidth', 'medium-bandwidth');
        this.dispatchEvent('bandwidthModeChanged', { mode: 'high' });
    }

    /**
     * Log performance metric
     * @param {PerformanceEntry} entry - Performance entry
     */
    logPerformanceMetric(entry) {
        console.log(`Performance: ${entry.name} - ${entry.duration}ms`);
    }

    /**
     * Dispatch custom event
     * @param {string} eventName - Event name
     * @param {*} detail - Event detail
     */
    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }

    /**
     * Get performance statistics
     * @returns {Object} Performance statistics
     */
    getStats() {
        return {
            cacheSize: this.cache.size,
            debounceTimers: this.debounceTimers.size,
            throttleTimers: this.throttleTimers.size,
            memoryUsage: performance.memory ? {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            } : null
        };
    }

    /**
     * Destroy performance optimizer
     */
    destroy() {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        this.clearCache();
        this.debounceTimers.clear();
        this.throttleTimers.clear();
    }
}
