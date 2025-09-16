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
                duration: 750,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#e2e8f0',
                        font: {
                            family: 'Inter, sans-serif'
                        }
                    }
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
                    borderColor: '#fbbf24',
                    backgroundColor: 'rgba(251, 191, 36, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                ...this.chartConfigs,
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#94a3b8'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#94a3b8'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
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
        
        chart.data.labels = data.labels;
        chart.data.datasets[0].data = data.values;
        chart.update('none'); // No animation for real-time updates
    }

    /**
     * Update chart type
     * @param {string} type - Chart type (line, bar, doughnut)
     */
    updateChartType(type) {
        const chart = this.charts.get('realTime');
        if (!chart) return;

        chart.config.type = type;
        
        // Update data structure for different chart types
        if (type === 'doughnut') {
            chart.data.datasets[0].data = [30, 25, 20, 15, 10];
            chart.data.labels = ['Football', 'Cricket', 'Tennis', 'Rugby', 'Other'];
        } else if (type === 'bar') {
            chart.data.datasets[0].data = this.generateRealTimeData().values;
        }
        
        chart.update();
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
                    borderWidth: 2,
                    fill: true
                }, {
                    label: 'Unique Visitors',
                    data: data.uniqueVisitors || this.generateRandomData(7),
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                ...this.chartConfigs,
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#94a3b8' }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#94a3b8' }
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
                        'rgba(251, 191, 36, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(139, 92, 246, 0.8)'
                    ],
                    borderColor: [
                        '#fbbf24',
                        '#10b981',
                        '#3b82f6',
                        '#ef4444',
                        '#8b5cf6'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                ...this.chartConfigs,
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#94a3b8' }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#94a3b8' }
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
                        'rgba(251, 191, 36, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(59, 130, 246, 0.8)'
                    ],
                    borderColor: [
                        '#fbbf24',
                        '#10b981',
                        '#3b82f6'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                ...this.chartConfigs,
                cutout: '60%',
                plugins: {
                    ...this.chartConfigs.plugins,
                    tooltip: {
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
                    backgroundColor: 'rgba(139, 92, 246, 0.8)',
                    borderColor: '#8b5cf6',
                    borderWidth: 1
                }]
            },
            options: {
                ...this.chartConfigs,
                indexAxis: 'y',
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#94a3b8' }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#94a3b8' }
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
     * Get chart statistics
     * @returns {Object} Chart statistics
     */
    getStats() {
        return {
            totalCharts: this.charts.size,
            chartTypes: Array.from(this.charts.keys())
        };
    }
}
