import routes from './routes/routes';
import { parseActiveUrl } from './routes/url-parser';

class App {
  constructor({ content }) {
    if (!content) {
      throw new Error('Content element is required');
    }
    
    this._content = content;
    this._routes = routes;
    this._mainContent = document.querySelector('#mainContent');
    
    if (!this._mainContent) {
      throw new Error('Main content element is required');
    }
    
    this._initialAppShell();
  }

  _initialAppShell() {
    // Initialize navbar
    this._initNavbar();
  }

  _initNavbar() {
    const header = document.querySelector('header');
    if (!header) return;

    const isLoggedIn = !!localStorage.getItem('token');
    const currentPath = window.location.hash;

    // Don't show navbar on auth pages
    if (currentPath === '#/login' || currentPath === '#/register') {
      header.innerHTML = '';
      return;
    }

    // If not logged in and not on auth page, redirect to login
    if (!isLoggedIn && currentPath !== '#/login' && currentPath !== '#/register') {
      window.location.hash = '#/login';
      return;
    }

    header.innerHTML = `
      <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container">
          <a class="navbar-brand" href="#/">Story App</a>
          
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              ${isLoggedIn ? `
                <li class="nav-item">
                  <a class="nav-link" href="#/">Home</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#/maps">Maps</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#/add">Add Story</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#" id="logoutButton">Logout</a>
                </li>
              ` : `
                <li class="nav-item">
                  <a class="nav-link" href="#/login">Login</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#/register">Register</a>
                </li>
              `}
            </ul>
          </div>
        </div>
      </nav>
    `;

    // Add logout handler
    if (isLoggedIn) {
      const logoutButton = document.querySelector('#logoutButton');
      if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem('token');
          window.location.hash = '#/login';
          window.location.reload();
        });
      }
    }
  }

  async renderPage() {
    try {
      // Re-initialize navbar on each page render
      this._initNavbar();

      const { route, params } = parseActiveUrl(this._routes);
      
      if (route) {
        // Initialize the page
        const presenter = route.init(params);
        
        // Check if presenter has a view instance
        if (presenter?.view && typeof presenter.view.render === 'function') {
          // Render the view
          await presenter.view.render();
          
          // Call afterRender if it exists
          if (typeof presenter.view.afterRender === 'function') {
            await presenter.view.afterRender();
          }
        } else {
          throw new Error('Invalid page configuration');
        }
      } else {
        // Handle 404 or redirect to home/login
        const isLoggedIn = !!localStorage.getItem('token');
        window.location.hash = isLoggedIn ? '#/' : '#/login';
      }
    } catch (error) {
      console.error('Error rendering page:', error);
      this._showErrorPage(error);
    }
  }

  _showErrorPage(error) {
    if (this._mainContent) {
      this._mainContent.innerHTML = `
        <div class="container py-5">
          <div class="alert alert-danger">
            <h4 class="alert-heading">Error</h4>
            <p>${error.message || 'An error occurred while loading the page.'}</p>
            <hr>
            <a href="#/" class="btn btn-primary">Go to Home</a>
          </div>
        </div>
      `;
    }
  }

  _parseActiveUrl() {
    const hash = window.location.hash.slice(1).toLowerCase();
    return hash || '/';
  }
}

export default App; 