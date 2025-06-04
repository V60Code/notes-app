// Import styles
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'sweetalert2/dist/sweetalert2.min.css';
import '../styles/main.css';

// Import components
import './components/app-bar';

// Import app
import App from './app';

// Initialize app when DOM is ready
const initApp = () => {
  const appElement = document.querySelector('#app');
  if (!appElement) {
    console.error('App element not found');
    return;
  }

  const app = new App({ content: appElement });

  // Handle routes
  window.addEventListener('hashchange', () => {
    app.renderPage();
  });

  app.renderPage();
};

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
