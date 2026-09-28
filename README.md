# Sports Dashboard

A responsive sports news and analytics dashboard built with vanilla JavaScript and Chart.js. It covers football, cricket and tennis with live-style scores, a news feed, interactive charts and built-in performance and usage monitoring.

All data is mocked. The app tries a placeholder API and falls back to generated data, and the WebSocket connection is simulated, so it runs fully offline with no backend or API keys.

## Features

- **Scores and news**: live-style scores and a breaking-news feed with timestamps, refreshed every 30 seconds
- **Multi-sport tabs**: overview, football, cricket, tennis and analytics views
- **Interactive charts**: multiple chart types built with Chart.js
- **Performance monitoring**: tracks page load time, API response time, error rate and JavaScript heap usage
- **Usage analytics**: page views, interactions, sessions and device information (kept in the browser and logged to the console; nothing is sent to a server)
- **Responsive dark UI**: single-column mobile layout up to 768px, adaptive grid on tablet, full grid on desktop
- **Error handling**: fallback data and user-facing error and loading states
- **Unit and integration tests**: an in-browser test suite for the data, chart, performance and analytics services

## Tech Stack

- HTML5, CSS3 (Grid, Flexbox)
- JavaScript (ES6+) organised as small service classes, with no framework or build step
- [Chart.js](https://www.chartjs.org/) for charts and [Font Awesome](https://fontawesome.com/) for icons, both loaded from a CDN
- Deployed as a static site on Vercel

## Getting Started

### Prerequisites

- A modern browser
- Node.js 14 or later (optional, only for the local dev server)

### Run locally

```bash
git clone https://github.com/ashaz3256/sports-demo.git
cd sports-demo
npm install
npm start
```

The app opens at [http://localhost:8000](http://localhost:8000). Because the app is static, you can also serve the folder with any static file server.

### Tests

The test suite runs automatically in the browser console when the page is served from `localhost` or `127.0.0.1`. To run it manually, open the console and run:

```javascript
new TestSuite().runAllTests();
```

## Project Structure

```
index.html                  Page markup
styles.css                  Styles and responsive layout
js/
  app.js                    Application controller
  dataService.js            Data fetching with mock-data fallback
  chartService.js           Chart creation and updates
  websocketService.js       Simulated live-update connection
  notificationService.js    In-app notifications
  performanceMonitor.js     Performance metrics
  performanceOptimizer.js   Rendering and loading optimisations
  analyticsService.js       Usage analytics
  tests.js                  In-browser test suite
```

## Deployment

The project is a static site and can be hosted anywhere. With the Vercel CLI:

```bash
vercel --prod
```

## License

Released under the [MIT License](LICENSE).
