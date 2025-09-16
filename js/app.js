/**
 * Sky Sports Dashboard - Main Application
 * 
 * This file contains the main application logic for the Sky Sports Dashboard.
 * It demonstrates real-time data visualization, mobile-responsive design,
 * performance monitoring, and clean documented code.
 * 
 * @author Lumara Team
 * @version 1.0.0
 * @created 2024
 */

class SkySportsDashboard {
    constructor() {
        this.dataService = new DataService();
        this.chartService = new ChartService();
        this.performanceMonitor = new PerformanceMonitor();
        this.analyticsService = new AnalyticsService();
        
        this.currentTab = 'overview';
        this.refreshInterval = null;
        this.isLoading = false;
        
        this.init();
    }

    /**
     * Initialize the dashboard application
     */
    async init() {
        try {
            this.showLoading(true);
            
            // Initialize performance monitoring
            this.performanceMonitor.init();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Load initial data
            await this.loadInitialData();
            
            // Start real-time updates
            this.startRealTimeUpdates();
            
            // Initialize charts
            this.initializeCharts();
            
            this.showLoading(false);
            
            console.log('Sky Sports Dashboard initialized successfully');
        } catch (error) {
            console.error('Failed to initialize dashboard:', error);
            this.showError('Failed to initialize dashboard. Please refresh the page.');
        }
    }

    /**
     * Set up all event listeners for the dashboard
     */
    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Refresh button
        const refreshBtn = document.getElementById('refreshScores');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshLiveScores();
            });
        }

        // Chart type selector
        const chartTypeSelect = document.getElementById('chartType');
        if (chartTypeSelect) {
            chartTypeSelect.addEventListener('change', (e) => {
                this.updateChartType(e.target.value);
            });
        }

        // Sport selectors
        this.setupSportSelectors();

        // Analytics date range
        const updateAnalyticsBtn = document.getElementById('updateAnalytics');
        if (updateAnalyticsBtn) {
            updateAnalyticsBtn.addEventListener('click', () => {
                this.updateAnalytics();
            });
        }

        // Window resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Performance monitoring
        window.addEventListener('load', () => {
            this.performanceMonitor.recordPageLoad();
        });
    }

    /**
     * Set up sport-specific selectors
     */
    setupSportSelectors() {
        const selectors = [
            { id: 'footballLeague', sport: 'football' },
            { id: 'cricketSeries', sport: 'cricket' },
            { id: 'tennisTournament', sport: 'tennis' }
        ];

        selectors.forEach(({ id, sport }) => {
            const selector = document.getElementById(id);
            if (selector) {
                selector.addEventListener('change', () => {
                    this.loadSportData(sport, selector.value);
                });
            }
        });
    }

    /**
     * Load initial data for the dashboard
     */
    async loadInitialData() {
        try {
            // Load live scores
            await this.loadLiveScores();
            
            // Load breaking news
            await this.loadBreakingNews();
            
            // Load performance metrics
            this.updatePerformanceMetrics();
            
            // Load sport data for current tab
            if (this.currentTab !== 'overview' && this.currentTab !== 'analytics') {
                await this.loadSportData(this.currentTab);
            }
            
        } catch (error) {
            console.error('Error loading initial data:', error);
            throw error;
        }
    }

    /**
     * Switch between dashboard tabs
     * @param {string} tabName - Name of the tab to switch to
     */
    switchTab(tabName) {
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update active content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        this.currentTab = tabName;

        // Load data for the new tab
        if (tabName !== 'overview' && tabName !== 'analytics') {
            this.loadSportData(tabName);
        } else if (tabName === 'analytics') {
            this.loadAnalyticsData();
        }

        // Track tab switch in analytics
        this.analyticsService.trackEvent('tab_switch', { tab: tabName });
    }

    /**
     * Load live sports scores
     */
    async loadLiveScores() {
        try {
            const scores = await this.dataService.getLiveScores();
            this.renderLiveScores(scores);
        } catch (error) {
            console.error('Error loading live scores:', error);
            this.showError('Failed to load live scores');
        }
    }

    /**
     * Render live scores in the UI
     * @param {Array} scores - Array of live score objects
     */
    renderLiveScores(scores) {
        const container = document.getElementById('liveScores');
        if (!container) return;

        if (scores.length === 0) {
            container.innerHTML = '<p class="no-data">No live matches at the moment</p>';
            return;
        }

        container.innerHTML = scores.map(score => `
            <div class="score-item">
                <div class="score-teams">
                    <div class="team-name">${score.homeTeam}</div>
                    <div class="team-name">${score.awayTeam}</div>
                </div>
                <div class="team-score">${score.homeScore} - ${score.awayScore}</div>
                <div class="match-status">${score.status}</div>
            </div>
        `).join('');
    }

    /**
     * Load breaking news
     */
    async loadBreakingNews() {
        try {
            const news = await this.dataService.getBreakingNews();
            this.renderBreakingNews(news);
        } catch (error) {
            console.error('Error loading breaking news:', error);
            this.showError('Failed to load breaking news');
        }
    }

    /**
     * Render breaking news in the UI
     * @param {Array} news - Array of news objects
     */
    renderBreakingNews(news) {
        const container = document.getElementById('breakingNews');
        const countElement = document.getElementById('newsCount');
        
        if (!container) return;

        if (countElement) {
            countElement.textContent = news.length;
        }

        if (news.length === 0) {
            container.innerHTML = '<p class="no-data">No breaking news at the moment</p>';
            return;
        }

        container.innerHTML = news.map(item => `
            <div class="news-item">
                <div class="news-time">${this.formatTime(item.timestamp)}</div>
                <div class="news-content">
                    <div class="news-title">${item.title}</div>
                    <div class="news-summary">${item.summary}</div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Load sport-specific data
     * @param {string} sport - Sport name (football, cricket, tennis)
     * @param {string} league - League/tournament name
     */
    async loadSportData(sport, league = null) {
        try {
            this.showLoading(true);
            
            const data = await this.dataService.getSportData(sport, league);
            this.renderSportData(sport, data);
            
        } catch (error) {
            console.error(`Error loading ${sport} data:`, error);
            this.showError(`Failed to load ${sport} data`);
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * Render sport-specific data
     * @param {string} sport - Sport name
     * @param {Object} data - Sport data object
     */
    renderSportData(sport, data) {
        switch (sport) {
            case 'football':
                this.renderFootballData(data);
                break;
            case 'cricket':
                this.renderCricketData(data);
                break;
            case 'tennis':
                this.renderTennisData(data);
                break;
        }
    }

    /**
     * Render football data
     * @param {Object} data - Football data object
     */
    renderFootballData(data) {
        // Render fixtures
        const fixturesContainer = document.getElementById('footballFixtures');
        if (fixturesContainer && data.fixtures) {
            fixturesContainer.innerHTML = data.fixtures.map(fixture => `
                <div class="fixture-item">
                    <div class="fixture-teams">${fixture.homeTeam} vs ${fixture.awayTeam}</div>
                    <div class="fixture-time">${this.formatTime(fixture.kickoff)}</div>
                </div>
            `).join('');
        }

        // Render standings
        const standingsContainer = document.getElementById('footballStandings');
        if (standingsContainer && data.standings) {
            standingsContainer.innerHTML = `
                <div class="table-header">
                    <div class="table-row">
                        <div>Pos</div>
                        <div>Team</div>
                        <div>P</div>
                        <div>W</div>
                        <div>Pts</div>
                    </div>
                </div>
                ${data.standings.map(team => `
                    <div class="table-row">
                        <div>${team.position}</div>
                        <div>${team.name}</div>
                        <div>${team.played}</div>
                        <div>${team.won}</div>
                        <div>${team.points}</div>
                    </div>
                `).join('')}
            `;
        }
    }

    /**
     * Render cricket data
     * @param {Object} data - Cricket data object
     */
    renderCricketData(data) {
        // Render scorecard
        const scorecardContainer = document.getElementById('cricketScorecard');
        if (scorecardContainer && data.scorecard) {
            scorecardContainer.innerHTML = `
                <div class="match-info">
                    <h4>${data.scorecard.match}</h4>
                    <p>${data.scorecard.status}</p>
                </div>
                <div class="score-summary">
                    <div class="batting-team">
                        <strong>${data.scorecard.battingTeam}:</strong> 
                        ${data.scorecard.runs}/${data.scorecard.wickets} 
                        (${data.scorecard.overs} overs)
                    </div>
                </div>
            `;
        }

        // Render player stats
        const statsContainer = document.getElementById('cricketStats');
        if (statsContainer && data.stats) {
            statsContainer.innerHTML = data.stats.map(player => `
                <div class="player-stat">
                    <div class="player-name">${player.name}</div>
                    <div class="player-runs">${player.runs} runs</div>
                </div>
            `).join('');
        }
    }

    /**
     * Render tennis data
     * @param {Object} data - Tennis data object
     */
    renderTennisData(data) {
        // Render current matches
        const matchesContainer = document.getElementById('tennisMatches');
        if (matchesContainer && data.matches) {
            matchesContainer.innerHTML = data.matches.map(match => `
                <div class="match-item">
                    <div class="players">${match.player1} vs ${match.player2}</div>
                    <div class="score">${match.score}</div>
                    <div class="status">${match.status}</div>
                </div>
            `).join('');
        }

        // Render rankings
        const rankingsContainer = document.getElementById('tennisRankings');
        if (rankingsContainer && data.rankings) {
            rankingsContainer.innerHTML = `
                <div class="table-header">
                    <div class="table-row">
                        <div>Rank</div>
                        <div>Player</div>
                        <div>Points</div>
                    </div>
                </div>
                ${data.rankings.map(player => `
                    <div class="table-row">
                        <div>${player.rank}</div>
                        <div>${player.name}</div>
                        <div>${player.points}</div>
                    </div>
                `).join('')}
            `;
        }
    }

    /**
     * Load analytics data
     */
    async loadAnalyticsData() {
        try {
            this.showLoading(true);
            
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
            
            const data = await this.analyticsService.getAnalyticsData(startDate, endDate);
            this.renderAnalyticsData(data);
            
        } catch (error) {
            console.error('Error loading analytics data:', error);
            this.showError('Failed to load analytics data');
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * Render analytics data
     * @param {Object} data - Analytics data object
     */
    renderAnalyticsData(data) {
        // Render engagement chart
        this.chartService.createEngagementChart(data.engagement);
        
        // Render content performance chart
        this.chartService.createContentChart(data.content);
        
        // Render device breakdown chart
        this.chartService.createDeviceChart(data.devices);
        
        // Render geographic distribution chart
        this.chartService.createGeoChart(data.geography);
    }

    /**
     * Initialize all charts
     */
    initializeCharts() {
        // Initialize real-time chart
        this.chartService.createRealTimeChart();
        
        // Set default dates for analytics
        const today = new Date();
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        document.getElementById('startDate').value = lastWeek.toISOString().split('T')[0];
        document.getElementById('endDate').value = today.toISOString().split('T')[0];
    }

    /**
     * Start real-time updates
     */
    startRealTimeUpdates() {
        // Update every 30 seconds
        this.refreshInterval = setInterval(() => {
            this.updateRealTimeData();
        }, 30000);
    }

    /**
     * Update real-time data
     */
    async updateRealTimeData() {
        try {
            // Update live scores
            await this.loadLiveScores();
            
            // Update breaking news
            await this.loadBreakingNews();
            
            // Update performance metrics
            this.updatePerformanceMetrics();
            
            // Update real-time chart
            this.chartService.updateRealTimeChart();
            
            // Update last updated time
            this.updateLastUpdatedTime();
            
        } catch (error) {
            console.error('Error updating real-time data:', error);
        }
    }

    /**
     * Update performance metrics display
     */
    updatePerformanceMetrics() {
        const metrics = this.performanceMonitor.getMetrics();
        
        document.getElementById('pageLoadTime').textContent = metrics.pageLoadTime || '--';
        document.getElementById('apiResponseTime').textContent = metrics.apiResponseTime || '--';
        document.getElementById('activeUsers').textContent = metrics.activeUsers || '--';
        document.getElementById('errorRate').textContent = metrics.errorRate || '--';
    }

    /**
     * Update last updated time
     */
    updateLastUpdatedTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        const lastUpdatedElement = document.getElementById('lastUpdated');
        if (lastUpdatedElement) {
            lastUpdatedElement.textContent = timeString;
        }
    }

    /**
     * Refresh live scores manually
     */
    async refreshLiveScores() {
        const refreshBtn = document.getElementById('refreshScores');
        if (refreshBtn) {
            refreshBtn.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                refreshBtn.style.transform = 'rotate(0deg)';
            }, 500);
        }
        
        await this.loadLiveScores();
    }

    /**
     * Update chart type
     * @param {string} type - Chart type (line, bar, doughnut)
     */
    updateChartType(type) {
        this.chartService.updateChartType(type);
    }

    /**
     * Update analytics data
     */
    updateAnalytics() {
        this.loadAnalyticsData();
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Resize charts
        this.chartService.resizeCharts();
        
        // Update performance metrics
        this.performanceMonitor.recordResize();
    }

    /**
     * Show loading overlay
     * @param {boolean} show - Whether to show loading
     */
    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            if (show) {
                overlay.classList.add('active');
                this.isLoading = true;
            } else {
                overlay.classList.remove('active');
                this.isLoading = false;
            }
        }
    }

    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    showError(message) {
        console.error(message);
        // In a real application, you would show a user-friendly error message
        alert(message);
    }

    /**
     * Format time for display
     * @param {Date|string} time - Time to format
     * @returns {string} Formatted time string
     */
    formatTime(time) {
        const date = new Date(time);
        return date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Clean up resources
     */
    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        this.performanceMonitor.destroy();
        this.chartService.destroy();
    }
}

// Initialize the dashboard when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.skySportsDashboard = new SkySportsDashboard();
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.skySportsDashboard) {
        window.skySportsDashboard.destroy();
    }
});
