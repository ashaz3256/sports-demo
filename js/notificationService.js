/**
 * Notification Service - Handles real-time notifications and alerts
 * 
 * This service demonstrates real-time notification capabilities
 * with modern UI and sound effects.
 * 
 * @author Lumara Team
 * @version 1.0.0
 */

class NotificationService {
    constructor() {
        this.notifications = [];
        this.maxNotifications = 5;
        this.defaultDuration = 5000;
        this.soundEnabled = true;
        this.permissionGranted = false;
        
        this.init();
    }

    /**
     * Initialize notification service
     */
    init() {
        this.createNotificationContainer();
        this.requestPermission();
        this.setupStyles();
    }

    /**
     * Create notification container
     */
    createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    /**
     * Request notification permission
     */
    async requestPermission() {
        if ('Notification' in window) {
            try {
                const permission = await Notification.requestPermission();
                this.permissionGranted = permission === 'granted';
            } catch (error) {
                console.error('Error requesting notification permission:', error);
            }
        }
    }

    /**
     * Setup notification styles
     */
    setupStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 400px;
            }
            
            .notification {
                background: var(--glass-bg);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 1px solid var(--glass-border);
                border-radius: var(--border-radius-small);
                padding: 1rem 1.5rem;
                box-shadow: var(--shadow-medium);
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            }
            
            .notification.show {
                transform: translateX(0);
                opacity: 1;
            }
            
            .notification.hide {
                transform: translateX(100%);
                opacity: 0;
            }
            
            .notification::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 4px;
                background: var(--accent-gradient);
                border-radius: 0 2px 2px 0;
            }
            
            .notification-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 0.5rem;
            }
            
            .notification-title {
                font-weight: 700;
                color: var(--text-primary);
                font-size: 1rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--text-muted);
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 4px;
                transition: var(--transition);
            }
            
            .notification-close:hover {
                color: var(--text-primary);
                background: rgba(255, 255, 255, 0.1);
            }
            
            .notification-content {
                color: var(--text-secondary);
                font-size: 0.9rem;
                line-height: 1.4;
            }
            
            .notification-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: var(--accent-gradient);
                border-radius: 0 0 var(--border-radius-small) var(--border-radius-small);
                transition: width linear;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Show notification
     * @param {Object} options - Notification options
     */
    show(options) {
        const notification = {
            id: Date.now() + Math.random(),
            title: options.title || 'Notification',
            content: options.content || '',
            type: options.type || 'info',
            duration: options.duration || this.defaultDuration,
            sound: options.sound !== false,
            persistent: options.persistent || false,
            actions: options.actions || []
        };

        this.notifications.push(notification);
        this.renderNotification(notification);
        this.playSound(notification.sound);
        
        if (!notification.persistent) {
            this.autoHide(notification.id, notification.duration);
        }

        // Limit number of notifications
        if (this.notifications.length > this.maxNotifications) {
            this.hide(this.notifications[0].id);
        }
    }

    /**
     * Render notification
     * @param {Object} notification - Notification object
     */
    renderNotification(notification) {
        const container = document.getElementById('notification-container');
        const element = document.createElement('div');
        element.className = 'notification';
        element.id = `notification-${notification.id}`;
        
        element.innerHTML = `
            <div class="notification-header">
                <div class="notification-title">${notification.title}</div>
                <button class="notification-close" onclick="notificationService.hide(${notification.id})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="notification-content">${notification.content}</div>
            <div class="notification-progress"></div>
        `;

        container.appendChild(element);

        // Trigger animation
        setTimeout(() => {
            element.classList.add('show');
        }, 100);

        // Start progress bar
        if (!notification.persistent) {
            const progressBar = element.querySelector('.notification-progress');
            progressBar.style.width = '100%';
            progressBar.style.transitionDuration = `${notification.duration}ms`;
        }
    }

    /**
     * Hide notification
     * @param {number} id - Notification ID
     */
    hide(id) {
        const element = document.getElementById(`notification-${id}`);
        if (element) {
            element.classList.add('hide');
            setTimeout(() => {
                element.remove();
            }, 300);
        }

        this.notifications = this.notifications.filter(n => n.id !== id);
    }

    /**
     * Auto hide notification
     * @param {number} id - Notification ID
     * @param {number} duration - Duration in ms
     */
    autoHide(id, duration) {
        setTimeout(() => {
            this.hide(id);
        }, duration);
    }

    /**
     * Play notification sound
     * @param {boolean} enabled - Whether sound is enabled
     */
    playSound(enabled) {
        if (enabled && this.soundEnabled) {
            // Create audio context for notification sound
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
                
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            } catch (error) {
                console.log('Audio not supported or blocked');
            }
        }
    }

    /**
     * Show success notification
     * @param {string} title - Notification title
     * @param {string} content - Notification content
     */
    success(title, content) {
        this.show({
            title,
            content,
            type: 'success',
            duration: 3000
        });
    }

    /**
     * Show error notification
     * @param {string} title - Notification title
     * @param {string} content - Notification content
     */
    error(title, content) {
        this.show({
            title,
            content,
            type: 'error',
            duration: 5000
        });
    }

    /**
     * Show warning notification
     * @param {string} title - Notification title
     * @param {string} content - Notification content
     */
    warning(title, content) {
        this.show({
            title,
            content,
            type: 'warning',
            duration: 4000
        });
    }

    /**
     * Show info notification
     * @param {string} title - Notification title
     * @param {string} content - Notification content
     */
    info(title, content) {
        this.show({
            title,
            content,
            type: 'info',
            duration: 3000
        });
    }

    /**
     * Clear all notifications
     */
    clearAll() {
        this.notifications.forEach(notification => {
            this.hide(notification.id);
        });
    }

    /**
     * Set sound enabled
     * @param {boolean} enabled - Whether sound is enabled
     */
    setSoundEnabled(enabled) {
        this.soundEnabled = enabled;
    }

    /**
     * Get notification statistics
     * @returns {Object} Notification statistics
     */
    getStats() {
        return {
            totalNotifications: this.notifications.length,
            soundEnabled: this.soundEnabled,
            permissionGranted: this.permissionGranted
        };
    }
}
