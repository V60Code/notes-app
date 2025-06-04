class AppBar extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  render() {
    const isAuthenticated = localStorage.getItem('token') !== null;

    this.innerHTML = `
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div class="container">
          <a class="navbar-brand" href="${isAuthenticated ? '#/' : '#/login'}">Story App</a>
          ${isAuthenticated ? `
            <button 
              class="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav" 
              aria-controls="navbarNav" 
              aria-expanded="false" 
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav me-auto">
                <li class="nav-item">
                  <a class="nav-link" href="#/">Stories</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#/add">Add Story</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#/maps">Maps</a>
                </li>
              </ul>
              <button class="btn btn-outline-light" id="logout-button" type="button">
                Logout
              </button>
            </div>
          ` : ''}
        </div>
      </nav>
      <div style="margin-top: 56px;"></div>
    `;

    // Add logout handler if authenticated
    if (isAuthenticated) {
      const logoutButton = this.querySelector('#logout-button');
      if (logoutButton) {
        logoutButton.addEventListener('click', () => {
          localStorage.removeItem('token');
          window.location.hash = '#/login';
          window.location.reload();
        });
      }

      // Initialize Bootstrap navbar toggler
      const navbarToggler = this.querySelector('.navbar-toggler');
      const navbarCollapse = this.querySelector('.navbar-collapse');
      
      if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', () => {
          navbarCollapse.classList.toggle('show');
        });

        // Close navbar when clicking outside
        document.addEventListener('click', (event) => {
          if (!navbarToggler.contains(event.target) && !navbarCollapse.contains(event.target)) {
            navbarCollapse.classList.remove('show');
          }
        });

        // Close navbar when clicking on nav links
        const navLinks = navbarCollapse.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
          link.addEventListener('click', () => {
            navbarCollapse.classList.remove('show');
          });
        });
      }
    }
  }
}

// Register custom element
customElements.define('app-bar', AppBar);

export default AppBar; 