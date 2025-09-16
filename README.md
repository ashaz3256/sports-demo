# Sky Sports Dashboard Demo

A comprehensive sports news dashboard built to demonstrate modern web development skills for the Sky News/Sky Sports Software Engineer position.

## 🎯 Project Overview

This project showcases a real-time sports dashboard with advanced features including:
- **Real-time data visualization** using Chart.js
- **Mobile-responsive design** with modern CSS Grid and Flexbox
- **Performance monitoring** with custom metrics tracking
- **Clean, documented code** with comprehensive unit tests
- **Analytics integration** for user behavior tracking

## 🚀 Features

### Core Functionality
- **Live Sports Scores** - Real-time updates for football, cricket, tennis
- **Breaking News Feed** - Dynamic news updates with timestamps
- **Interactive Charts** - Multiple chart types with real-time data
- **Performance Metrics** - Live monitoring of page load times and API response times
- **Multi-sport Support** - Dedicated sections for Football, Cricket, and Tennis
- **Analytics Dashboard** - User engagement and content performance metrics

### Technical Features
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Real-time Updates** - Automatic data refresh every 30 seconds
- **Performance Monitoring** - Built-in performance tracking and optimization
- **Error Handling** - Comprehensive error handling and fallback mechanisms
- **Unit Testing** - Complete test suite with 25+ test cases
- **Code Documentation** - Extensive JSDoc comments and inline documentation

## 🛠 Tech Stack

### Frontend
- **HTML5** - Semantic markup with accessibility features
- **CSS3** - Modern styling with Grid, Flexbox, and animations
- **JavaScript (ES6+)** - Modern JavaScript with classes and modules
- **Chart.js** - Data visualization library
- **Font Awesome** - Icon library

### Architecture
- **Modular Design** - Separated concerns with dedicated service classes
- **Performance Optimization** - Lazy loading, caching, and efficient rendering
- **Error Handling** - Comprehensive error tracking and user feedback
- **Analytics Integration** - User behavior and performance tracking

## 📁 Project Structure

```
sky-sports-demo/
├── index.html              # Main HTML file
├── styles.css              # CSS styles and responsive design
├── js/
│   ├── app.js              # Main application controller
│   ├── dataService.js      # API calls and data management
│   ├── chartService.js     # Chart creation and management
│   ├── performanceMonitor.js # Performance tracking
│   ├── analyticsService.js # User analytics and tracking
│   └── tests.js            # Unit tests and test suite
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for CORS compliance)

### Installation
1. Clone or download the project files
2. Open `index.html` in a web browser
3. For development, use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

### Running Tests
Tests run automatically in development mode. To run manually:
```javascript
// Open browser console and run:
const testSuite = new TestSuite();
testSuite.runAllTests();
```

## 📊 Performance Metrics

The dashboard includes comprehensive performance monitoring:

- **Page Load Time** - Tracks initial page load performance
- **API Response Time** - Monitors data fetching performance
- **Active Users** - Real-time user activity tracking
- **Error Rate** - Tracks and reports application errors
- **Memory Usage** - Monitors JavaScript heap usage
- **User Engagement** - Tracks user interactions and behavior

## 🧪 Testing

### Test Coverage
- **Data Service Tests** - API calls, caching, and data generation
- **Chart Service Tests** - Chart creation, updates, and data handling
- **Performance Monitor Tests** - Metrics collection and reporting
- **Analytics Service Tests** - User tracking and analytics
- **Integration Tests** - End-to-end functionality testing

### Running Tests
```javascript
// All tests run automatically on page load in development
// Manual test execution:
const testSuite = new TestSuite();
await testSuite.runAllTests();

// Performance testing:
PerformanceTest.measureExecutionTime(() => {
    // Your function here
}, 'Function Name');
```

## 📱 Responsive Design

The dashboard is fully responsive with breakpoints:
- **Desktop** - 1200px+ (Full grid layout)
- **Tablet** - 768px-1199px (Adaptive grid)
- **Mobile** - <768px (Single column layout)

## 🎨 Design Features

- **Modern UI** - Clean, professional design inspired by Sky Sports
- **Dark Theme** - Easy on the eyes with high contrast
- **Smooth Animations** - CSS transitions and hover effects
- **Loading States** - User feedback during data loading
- **Error States** - Graceful error handling and user messaging

## 🔧 Customization

### Adding New Sports
1. Add new tab in `index.html`
2. Create sport data in `dataService.js`
3. Add rendering logic in `app.js`
4. Update CSS for new sport styling

### Adding New Charts
1. Create chart method in `chartService.js`
2. Add chart container in HTML
3. Initialize chart in `app.js`
4. Update responsive CSS

### Performance Monitoring
- Modify `performanceMonitor.js` for custom metrics
- Add new tracking in `analyticsService.js`
- Update dashboard display in `app.js`

## 📈 Analytics

The dashboard tracks comprehensive user analytics:
- **Page Views** - Tracked with timestamps and referrers
- **User Interactions** - Clicks, scrolls, and form submissions
- **Session Data** - User sessions and activity patterns
- **Performance Data** - Load times and error rates
- **Device Information** - Browser, platform, and viewport data

## 🚀 Deployment

### Static Hosting
The project can be deployed to any static hosting service:
- **Vercel** - `vercel --prod`
- **Netlify** - Drag and drop deployment
- **GitHub Pages** - Automatic deployment from repository
- **AWS S3** - Static website hosting

### Environment Variables
No environment variables required - all data is mocked for demonstration.

## 🤝 Contributing

This is a demonstration project, but contributions are welcome:
1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is created for demonstration purposes for the Sky News/Sky Sports Software Engineer position.

## 👥 Authors

**Lumara Team**
- Aspiring Software Engineers
- Portfolio: [lumara-website.vercel.app](https://lumara-website.vercel.app)
- TradingJournalPro: [tradingjournalpro.co.uk](https://tradingjournalpro.co.uk)

## 🙏 Acknowledgments

- Sky Sports for design inspiration
- Chart.js for data visualization
- Font Awesome for icons
- Modern web standards and best practices

---

**Built with ❤️ for the Sky News/Sky Sports Software Engineer position**

*Demonstrating: Real-time data visualization, Mobile-responsive design, Performance monitoring, Clean documented code, Unit testing*
