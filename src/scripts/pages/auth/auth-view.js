class AuthView {
  constructor() {
    this.presenter = null;
  }

  async render() {
    this._createInitialElements();
    return this;
  }

  _createInitialElements() {
    const mainContent = document.querySelector('#mainContent');
    if (!mainContent) return;

    mainContent.innerHTML = `
      <div class="container">
        <div class="row justify-content-center min-vh-100 align-items-center py-5">
          <div class="col-12 col-md-6 col-lg-4">
            <div class="card shadow auth-card">
              <div class="card-body p-4">
                <h1 class="h4 text-center mb-4 page-title">Login</h1>
                
                <form id="loginForm">
                  <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" required>
                  </div>
                  
                  <div class="mb-4">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" required>
                  </div>
                  
                  <button type="submit" class="btn btn-primary w-100" id="loginButton">
                    Login
                  </button>

                  <div class="text-center mt-3">
                    <p class="mb-0">Don't have an account? 
                      <a href="#/register">Register here</a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading overlay -->
      <div id="loadingOverlay" class="loading-overlay d-none position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style="background: rgba(255,255,255,0.8); z-index: 9999;">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;

    // Get DOM elements
    this.form = document.querySelector('#loginForm');
    this.emailInput = document.querySelector('#email');
    this.passwordInput = document.querySelector('#password');
    this.loadingOverlay = document.querySelector('#loadingOverlay');
    this.loginButton = document.querySelector('#loginButton');

    // Add form submit handler
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (this.presenter) {
        // Disable form while submitting
        this._disableForm();
        
        await this.presenter.handleLogin({
          email: this.emailInput.value,
          password: this.passwordInput.value
        });

        // Re-enable form after submission (in case of error)
        this._enableForm();
      }
    });
  }

  async afterRender() {
    // Any additional setup after render can go here
  }

  setPresenter(presenter) {
    this.presenter = presenter;
  }

  showLoading() {
    if (this.loadingOverlay) {
      this.loadingOverlay.classList.remove('d-none');
    }
    this._disableForm();
  }

  hideLoading() {
    if (this.loadingOverlay) {
      this.loadingOverlay.classList.add('d-none');
    }
    this._enableForm();
  }

  _disableForm() {
    if (this.form) {
      this.emailInput.disabled = true;
      this.passwordInput.disabled = true;
      this.loginButton.disabled = true;
    }
  }

  _enableForm() {
    if (this.form) {
      this.emailInput.disabled = false;
      this.passwordInput.disabled = false;
      this.loginButton.disabled = false;
    }
  }

  showError(message) {
    window.Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message
    });
  }

  clearForm() {
    this.form.reset();
  }
}

export default AuthView; 