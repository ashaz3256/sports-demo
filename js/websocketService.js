/**
 * WebSocket Service - Handles real-time data connections
 * 
 * This service demonstrates real-time data streaming capabilities
 * using WebSocket connections for live updates.
 * 
 * @author Lumara Team
 * @version 1.0.0
 */

class WebSocketService {
    constructor() {
        this.socket = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectInterval = 3000;
        this.heartbeatInterval = 30000;
        this.heartbeatTimer = null;
        this.isConnected = false;
        this.eventListeners = new Map();
        this.messageQueue = [];
        
        this.init();
    }

    /**
     * Initialize WebSocket connection
     */
    init() {
        this.connect();
    }

    /**
     * Connect to WebSocket server
     */
    connect() {
        try {
            // In a real application, this would connect to an actual WebSocket server
            // For demo purposes, we'll simulate the connection
            this.simulateConnection();
        } catch (error) {
            console.error('WebSocket connection failed:', error);
            this.handleReconnect();
        }
    }

    /**
     * Simulate WebSocket connection for demo purposes
     */
    simulateConnection() {
        this.isConnected = true;
        this.emit('connected');
        this.startHeartbeat();
        this.startDataSimulation();
        
        console.log('WebSocket connected (simulated)');
    }

    /**
     * Start heartbeat to keep connection alive
     */
    startHeartbeat() {
        this.heartbeatTimer = setInterval(() => {
            if (this.isConnected) {
                this.send('ping');
            }
        }, this.heartbeatInterval);
    }

    /**
     * Start data simulation for demo purposes
     */
    startDataSimulation() {
        // Simulate live score updates
        setInterval(() => {
            if (this.isConnected) {
                this.simulateLiveScoreUpdate();
            }
        }, 10000);

        // Simulate breaking news updates
        setInterval(() => {
            if (this.isConnected) {
                this.simulateBreakingNewsUpdate();
            }
        }, 15000);

        // Simulate performance metrics updates
        setInterval(() => {
            if (this.isConnected) {
                this.simulatePerformanceUpdate();
            }
        }, 5000);
    }

    /**
     * Simulate live score update
     */
    simulateLiveScoreUpdate() {
        const scores = [
            {
                id: 'match_1',
                homeTeam: 'Manchester United',
                awayTeam: 'Liverpool',
                homeScore: Math.floor(Math.random() * 4),
                awayScore: Math.floor(Math.random() * 4),
                status: 'Live',
                minute: Math.floor(Math.random() * 90) + 1,
                league: 'Premier League'
            },
            {
                id: 'match_2',
                homeTeam: 'Arsenal',
                awayTeam: 'Chelsea',
                homeScore: Math.floor(Math.random() * 3),
                awayScore: Math.floor(Math.random() * 3),
                status: 'Live',
                minute: Math.floor(Math.random() * 90) + 1,
                league: 'Premier League'
            }
        ];

        this.emit('liveScoreUpdate', scores);
    }

    /**
     * Simulate breaking news update
     */
    simulateBreakingNewsUpdate() {
        const newsItems = [
            'Major transfer announcement expected',
            'Injury update: Key player ruled out',
            'Match postponed due to weather',
            'New sponsorship deal announced',
            'Manager press conference scheduled'
        ];

        const randomNews = newsItems[Math.floor(Math.random() * newsItems.length)];
        
        const news = {
            id: Date.now(),
            title: randomNews,
            summary: 'Breaking news update from the world of sports',
            timestamp: new Date(),
            category: 'Breaking News',
            priority: 'high'
        };

        this.emit('breakingNewsUpdate', news);
    }

    /**
     * Simulate performance metrics update
     */
    simulatePerformanceUpdate() {
        const metrics = {
            pageLoadTime: Math.floor(Math.random() * 100) + 50,
            apiResponseTime: Math.floor(Math.random() * 200) + 100,
            activeUsers: Math.floor(Math.random() * 1000) + 500,
            errorRate: Math.random() * 2,
            memoryUsage: Math.floor(Math.random() * 50) + 20,
            cpuUsage: Math.floor(Math.random() * 30) + 10
        };

        this.emit('performanceUpdate', metrics);
    }

    /**
     * Send message through WebSocket
     * @param {string} type - Message type
     * @param {Object} data - Message data
     */
    send(type, data = {}) {
        const message = {
            type,
            data,
            timestamp: new Date().toISOString()
        };

        if (this.isConnected) {
            // In a real application, this would send through WebSocket
            console.log('WebSocket message sent:', message);
        } else {
            this.messageQueue.push(message);
        }
    }

    /**
     * Emit event to listeners
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    emit(event, data) {
        const listeners = this.eventListeners.get(event) || [];
        listeners.forEach(listener => {
            try {
                listener(data);
            } catch (error) {
                console.error(`Error in event listener for ${event}:`, error);
            }
        });
    }

    /**
     * Add event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    /**
     * Remove event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    off(event, callback) {
        const listeners = this.eventListeners.get(event) || [];
        const index = listeners.indexOf(callback);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    }

    /**
     * Handle reconnection
     */
    handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            
            setTimeout(() => {
                this.connect();
            }, this.reconnectInterval);
        } else {
            console.error('Max reconnection attempts reached');
            this.emit('connectionFailed');
        }
    }

    /**
     * Disconnect WebSocket
     */
    disconnect() {
        this.isConnected = false;
        
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
        
        this.emit('disconnected');
        console.log('WebSocket disconnected');
    }

    /**
     * Get connection status
     * @returns {boolean} Connection status
     */
    getConnectionStatus() {
        return this.isConnected;
    }

    /**
     * Get connection statistics
     * @returns {Object} Connection statistics
     */
    getStats() {
        return {
            isConnected: this.isConnected,
            reconnectAttempts: this.reconnectAttempts,
            messageQueueLength: this.messageQueue.length,
            eventListenersCount: Array.from(this.eventListeners.values()).reduce((total, listeners) => total + listeners.length, 0)
        };
    }

    /**
     * Clear all event listeners
     */
    clearListeners() {
        this.eventListeners.clear();
    }

    /**
     * Destroy WebSocket service
     */
    destroy() {
        this.disconnect();
        this.clearListeners();
        this.messageQueue = [];
    }
}
