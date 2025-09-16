/**
 * Chart Service - Handles all chart creation and management
 * 
 * This service demonstrates real-time data visualization capabilities
 * using Chart.js library with proper performance optimization.
 * 
 * @author Lumara Team
 * @version 1.0.0
 */

class ChartService {
    constructor() {
        this.charts = new Map();
        this.chartConfigs = {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart',
                animateRotate: true,
                animateScale: true
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#f8fafc',
                        font: {
                            family: 'Inter, sans-serif',
                            size: 12,
                            weight: '600'
                        },
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    },
                    position: 'top',
                    align: 'start'
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(10px)',
                    titleColor: '#f8fafc',
                    bodyColor: '#cbd5e1',
                    borderColor: 'rgba(79, 172, 254, 0.3)',
                    borderWidth: 1,
                    cornerRadius: 12,
                    displayColors: true,
                    titleFont: {
                        family: 'Inter, sans-serif',
                        size: 14,
                        weight: '700'
                    },
                    bodyFont: {
                        family: 'Inter, sans-serif',
                        size: 12,
                        weight: '500'
                    },
                    padding: 12,
                    titleSpacing: 8,
                    bodySpacing: 6
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            elements: {
                point: {
                    radius: 6,
                    hoverRadius: 8,
                    borderWidth: 3,
                    hoverBorderWidth: 4
                },
                line: {
                    tension: 0.4,
                    borderWidth: 3,
                    hoverBorderWidth: 4
                },
                bar: {
                    borderRadius: 8,
                    borderSkipped: false
                }
            }
        };
    }

    /**
     * Create real-time analytics chart
     */
    createRealTimeChart() {
        const ctx = document.getElementById('realTimeChart');
        if (!ctx) return;

        const data = this.generateRealTimeData();
        
        const config = {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'User Activity',
                    data: data.values,
                    borderColor: '#4facfe',
                    backgroundColor: 'rgba(79, 172, 254, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#4facfe',
                    pointBorderColor: '#ffffff',
                    pointHoverBackgroundColor: '#ffffff',
                    pointHoverBorderColor: '#4facfe',
                    pointHoverBorderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointHitRadius: 10,
                    pointHoverBorderWidth: 4,
                    borderCapStyle: 'round',
                    borderJoinStyle: 'round',
                    shadowOffsetX: 0,
                    shadowOffsetY: 4,
                    shadowBlur: 8,
                    shadowColor: 'rgba(79, 172, 254, 0.3)'
                }]
            },
            options: {
                ...this.chartConfigs,
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false,
                            drawTicks: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: {
                                family: 'Inter, sans-serif',
                                size: 11,
                                weight: '500'
                            },
                            padding: 10
                        },
                        border: {
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false,
                            drawTicks: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: {
                                family: 'Inter, sans-serif',
                                size: 11,
                                weight: '500'
                            },
                            padding: 10
                        },
                        border: {
                            display: false
                        }
                    }
                },
                plugins: {
                    ...this.chartConfigs.plugins,
                    legend: {
                        ...this.chartConfigs.plugins.legend,
                        display: true,
                        position: 'top',
                        align: 'start'
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                onHover: (event, activeElements) => {
                    event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
                }
            }
        };

        const chart = new Chart(ctx, config);
        this.charts.set('realTime', chart);
    }

    /**
     * Update real-time chart with new data
     */
    updateRealTimeChart() {
        const chart = this.charts.get('realTime');
        if (!chart) return;

        const data = this.generateRealTimeData();
        
        // Smooth transition for real-time updates
        chart.data.labels = data.labels;
        chart.data.datasets[0].data = data.values;
        
        // Add subtle animation for real-time updates
        chart.update('active', {
            duration: 300,
            easing: 'easeInOutQuart'
        });
        
        // Add pulse effect to the chart
        this.addPulseEffect(chart);
    }

    /**
     * Add pulse effect to chart
     * @param {Chart} chart - Chart instance
     */
    addPulseEffect(chart) {
        const canvas = chart.canvas;
        canvas.style.transition = 'transform 0.3s ease';
        canvas.style.transform = 'scale(1.02)';
        
        setTimeout(() => {
            canvas.style.transform = 'scale(1)';
        }, 300);
    }

    /**
     * Update chart type
     * @param {string} type - Chart type (line, bar, doughnut)
     */
    updateChartType(type) {
        const chart = this.charts.get('realTime');
        if (!chart) return;

        // Add transition effect
        const canvas = chart.canvas;
        canvas.style.transition = 'opacity 0.3s ease';
        canvas.style.opacity = '0.7';

        setTimeout(() => {
            chart.config.type = type;
            
            // Update data structure for different chart types
            if (type === 'doughnut') {
                chart.data.datasets[0].data = [30, 25, 20, 15, 10];
                chart.data.labels = ['Football', 'Cricket', 'Tennis', 'Rugby', 'Other'];
                chart.data.datasets[0].backgroundColor = [
                    'rgba(79, 172, 254, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(139, 92, 246, 0.8)'
                ];
                chart.data.datasets[0].borderColor = [
                    '#4facfe',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6'
                ];
                chart.data.datasets[0].borderWidth = 2;
            } else if (type === 'bar') {
                const data = this.generateRealTimeData();
                chart.data.datasets[0].data = data.values;
                chart.data.labels = data.labels;
                chart.data.datasets[0].backgroundColor = 'rgba(79, 172, 254, 0.8)';
                chart.data.datasets[0].borderColor = '#4facfe';
                chart.data.datasets[0].borderWidth = 1;
            } else if (type === 'line') {
                const data = this.generateRealTimeData();
                chart.data.datasets[0].data = data.values;
                chart.data.labels = data.labels;
                chart.data.datasets[0].backgroundColor = 'rgba(79, 172, 254, 0.1)';
                chart.data.datasets[0].borderColor = '#4facfe';
                chart.data.datasets[0].borderWidth = 3;
                chart.data.datasets[0].fill = true;
            }
            
            chart.update('active', {
                duration: 500,
                easing: 'easeInOutQuart'
            });
            
            canvas.style.opacity = '1';
        }, 300);
    }

    /**
     * Create engagement chart
     * @param {Object} data - Engagement data
     */
    createEngagementChart(data) {
        const ctx = document.getElementById('engagementChart');
        if (!ctx) return;

        const config = {
            type: 'line',
            data: {
                labels: data.labels || this.generateTimeLabels(),
                datasets: [{
                    label: 'Page Views',
                    data: data.pageViews || this.generateRandomData(7),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#ffffff',
                    pointHoverBackgroundColor: '#ffffff',
                    pointHoverBorderColor: '#10b981',
                    pointHoverBorderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointHitRadius: 10,
                    borderCapStyle: 'round',
                    borderJoinStyle: 'round',
                    shadowOffsetX: 0,
                    shadowOffsetY: 4,
                    shadowBlur: 8,
                    shadowColor: 'rgba(16, 185, 129, 0.3)'
                }, {
                    label: 'Unique Visitors',
                    data: data.uniqueVisitors || this.generateRandomData(7),
                    borderColor: '#4facfe',
                    backgroundColor: 'rgba(79, 172, 254, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#4facfe',
                    pointBorderColor: '#ffffff',
                    pointHoverBackgroundColor: '#ffffff',
                    pointHoverBorderColor: '#4facfe',
                    pointHoverBorderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointHitRadius: 10,
                    borderCapStyle: 'round',
                    borderJoinStyle: 'round',
                    shadowOffsetX: 0,
                    shadowOffsetY: 4,
                    shadowBlur: 8,
                    shadowColor: 'rgba(79, 172, 254, 0.3)'
                }]
            },
            options: {
                ...this.chartConfigs,
                scales: {
                    x: {
                        grid: { 
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false,
                            drawTicks: false
                        },
                        ticks: { 
                            color: '#94a3b8',
                            font: {
                                family: 'Inter, sans-serif',
                                size: 11,
                                weight: '500'
                            },
                            padding: 10
                        },
                        border: {
                            display: false
                        }
                    },
                    y: {
                        grid: { 
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false,
                            drawTicks: false
                        },
                        ticks: { 
                            color: '#94a3b8',
                            font: {
                                family: 'Inter, sans-serif',
                                size: 11,
                                weight: '500'
                            },
                            padding: 10
                        },
                        border: {
                            display: false
                        }
                    }
                },
                plugins: {
                    ...this.chartConfigs.plugins,
                    legend: {
                        ...this.chartConfigs.plugins.legend,
                        display: true,
                        position: 'top',
                        align: 'start'
                    }
                }
            }
        };

        const chart = new Chart(ctx, config);
        this.charts.set('engagement', chart);
    }

    /**
     * Create content performance chart
     * @param {Object} data - Content performance data
     */
    createContentChart(data) {
        const ctx = document.getElementById('contentChart');
        if (!ctx) return;

        const config = {
            type: 'bar',
            data: {
                labels: data.labels || ['Football', 'Cricket', 'Tennis', 'Rugby', 'Golf'],
                datasets: [{
                    label: 'Views',
                    data: data.views || this.generateRandomData(5),
                    backgroundColor: [
                        'rgba(79, 172, 254, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(139, 92, 246, 0.8)'
                    ],
                    borderColor: [
                        '#4facfe',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6'
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                    shadowOffsetX: 0,
                    shadowOffsetY: 4,
                    shadowBlur: 8,
                    shadowColor: 'rgba(0, 0, 0, 0.1)'
                }]
            },
            options: {
                ...this.chartConfigs,
                scales: {
                    x: {
                        grid: { 
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false,
                            drawTicks: false
                        },
                        ticks: { 
                            color: '#94a3b8',
                            font: {
                                family: 'Inter, sans-serif',
                                size: 11,
                                weight: '500'
                            },
                            padding: 10
                        },
                        border: {
                            display: false
                        }
                    },
                    y: {
                        grid: { 
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false,
                            drawTicks: false
                        },
                        ticks: { 
                            color: '#94a3b8',
                            font: {
                                family: 'Inter, sans-serif',
                                size: 11,
                                weight: '500'
                            },
                            padding: 10
                        },
                        border: {
                            display: false
                        }
                    }
                },
                plugins: {
                    ...this.chartConfigs.plugins,
                    legend: {
                        ...this.chartConfigs.plugins.legend,
                        display: true,
                        position: 'top',
                        align: 'start'
                    }
                }
            }
        };

        const chart = new Chart(ctx, config);
        this.charts.set('content', chart);
    }

    /**
     * Create device breakdown chart
     * @param {Object} data - Device data
     */
    createDeviceChart(data) {
        const ctx = document.getElementById('deviceChart');
        if (!ctx) return;

        const config = {
            type: 'doughnut',
            data: {
                labels: data.labels || ['Desktop', 'Mobile', 'Tablet'],
                datasets: [{
                    data: data.values || [45, 40, 15],
                    backgroundColor: [
                        'rgba(79, 172, 254, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)'
                    ],
                    borderColor: [
                        '#4facfe',
                        '#10b981',
                        '#f59e0b'
                    ],
                    borderWidth: 3,
                    hoverBorderWidth: 4,
                    hoverOffset: 10,
                    shadowOffsetX: 0,
                    shadowOffsetY: 4,
                    shadowBlur: 8,
                    shadowColor: 'rgba(0, 0, 0, 0.1)'
                }]
            },
            options: {
                ...this.chartConfigs,
                cutout: '65%',
                plugins: {
                    ...this.chartConfigs.plugins,
                    legend: {
                        ...this.chartConfigs.plugins.legend,
                        display: true,
                        position: 'bottom',
                        align: 'center',
                        labels: {
                            ...this.chartConfigs.plugins.legend.labels,
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        ...this.chartConfigs.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                },
                elements: {
                    arc: {
                        borderWidth: 3,
                        hoverBorderWidth: 4
                    }
                }
            }
        };

        const chart = new Chart(ctx, config);
        this.charts.set('device', chart);
    }

    /**
     * Create geographic distribution chart
     * @param {Object} data - Geographic data
     */
    createGeoChart(data) {
        const ctx = document.getElementById('geoChart');
        if (!ctx) return;

        const config = {
            type: 'bar',
            data: {
                labels: data.labels || ['UK', 'US', 'Australia', 'India', 'Germany'],
                datasets: [{
                    label: 'Users',
                    data: data.values || this.generateRandomData(5),
                    backgroundColor: [
                        'rgba(79, 172, 254, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(139, 92, 246, 0.8)'
                    ],
                    borderColor: [
                        '#4facfe',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6'
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                    shadowOffsetX: 0,
                    shadowOffsetY: 4,
                    shadowBlur: 8,
                    shadowColor: 'rgba(0, 0, 0, 0.1)'
                }]
            },
            options: {
                ...this.chartConfigs,
                indexAxis: 'y',
                scales: {
                    x: {
                        grid: { 
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false,
                            drawTicks: false
                        },
                        ticks: { 
                            color: '#94a3b8',
                            font: {
                                family: 'Inter, sans-serif',
                                size: 11,
                                weight: '500'
                            },
                            padding: 10
                        },
                        border: {
                            display: false
                        }
                    },
                    y: {
                        grid: { 
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false,
                            drawTicks: false
                        },
                        ticks: { 
                            color: '#94a3b8',
                            font: {
                                family: 'Inter, sans-serif',
                                size: 11,
                                weight: '500'
                            },
                            padding: 10
                        },
                        border: {
                            display: false
                        }
                    }
                },
                plugins: {
                    ...this.chartConfigs.plugins,
                    legend: {
                        ...this.chartConfigs.plugins.legend,
                        display: true,
                        position: 'top',
                        align: 'start'
                    }
                }
            }
        };

        const chart = new Chart(ctx, config);
        this.charts.set('geo', chart);
    }

    /**
     * Resize all charts
     */
    resizeCharts() {
        this.charts.forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }

    /**
     * Generate real-time data for charts
     * @returns {Object} Chart data object
     */
    generateRealTimeData() {
        const now = new Date();
        const labels = [];
        const values = [];

        // Generate data for the last 24 hours
        for (let i = 23; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 60 * 60 * 1000);
            labels.push(time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
            
            // Generate realistic user activity data
            const baseActivity = 100;
            const randomVariation = Math.random() * 50;
            const timeVariation = Math.sin((i / 24) * Math.PI * 2) * 30;
            values.push(Math.max(0, Math.round(baseActivity + randomVariation + timeVariation)));
        }

        return { labels, values };
    }

    /**
     * Generate time labels for charts
     * @param {number} days - Number of days to generate
     * @returns {Array} Array of time labels
     */
    generateTimeLabels(days = 7) {
        const labels = [];
        const now = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            labels.push(date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' }));
        }
        
        return labels;
    }

    /**
     * Generate random data for charts
     * @param {number} count - Number of data points
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {Array} Array of random values
     */
    generateRandomData(count, min = 10, max = 100) {
        const data = [];
        for (let i = 0; i < count; i++) {
            data.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }
        return data;
    }

    /**
     * Destroy all charts
     */
    destroy() {
        this.charts.forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts.clear();
    }

    /**
     * Add chart animation on load
     * @param {Chart} chart - Chart instance
     */
    addLoadAnimation(chart) {
        const canvas = chart.canvas;
        canvas.style.opacity = '0';
        canvas.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            canvas.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            canvas.style.opacity = '1';
            canvas.style.transform = 'scale(1)';
        }, 100);
    }

    /**
     * Add hover effects to chart
     * @param {Chart} chart - Chart instance
     */
    addHoverEffects(chart) {
        const canvas = chart.canvas;
        
        canvas.addEventListener('mouseenter', () => {
            canvas.style.transition = 'transform 0.3s ease';
            canvas.style.transform = 'scale(1.02)';
        });
        
        canvas.addEventListener('mouseleave', () => {
            canvas.style.transform = 'scale(1)';
        });
    }

    /**
     * Add click effects to chart
     * @param {Chart} chart - Chart instance
     */
    addClickEffects(chart) {
        const canvas = chart.canvas;
        
        canvas.addEventListener('click', (event) => {
            canvas.style.transition = 'transform 0.1s ease';
            canvas.style.transform = 'scale(0.98)';
            
            setTimeout(() => {
                canvas.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    canvas.style.transform = 'scale(1)';
                }, 100);
            }, 100);
        });
    }

    /**
     * Create animated counter for chart values
     * @param {HTMLElement} element - Element to animate
     * @param {number} target - Target value
     * @param {number} duration - Animation duration in ms
     */
    animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }

    /**
     * Add chart loading state
     * @param {string} chartId - Chart ID
     */
    showChartLoading(chartId) {
        const canvas = document.getElementById(chartId);
        if (canvas) {
            const loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'chart-loading-overlay';
            loadingOverlay.innerHTML = `
                <div class="chart-loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading chart...</p>
                </div>
            `;
            canvas.parentNode.appendChild(loadingOverlay);
        }
    }

    /**
     * Hide chart loading state
     * @param {string} chartId - Chart ID
     */
    hideChartLoading(chartId) {
        const canvas = document.getElementById(chartId);
        if (canvas) {
            const loadingOverlay = canvas.parentNode.querySelector('.chart-loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.remove();
            }
        }
    }

    /**
     * Get chart statistics
     * @returns {Object} Chart statistics
     */
    getStats() {
        return {
            totalCharts: this.charts.size,
            chartTypes: Array.from(this.charts.keys()),
            activeCharts: Array.from(this.charts.values()).filter(chart => chart && !chart.destroyed).length
        };
    }
}
