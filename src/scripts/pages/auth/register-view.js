class RegisterView {
  constructor() {
    this.presenter = null;
  }

  async render() {
    this._createInitialElements();
    return this;
  }

  async afterRender() {
    if (this.presenter) {
      await this.presenter.init();
    }
  }

  _createInitialElements() {
    const mainContent = document.querySelector('#mainContent');
    if (!mainContent) {
      console.error('Main content element not found');
      return;
    }

    mainContent.innerHTML = `
      <div class="container">
        <div class="row justify-content-center min-vh-100 align-items-center">
          <div class="col-md-6 col-lg-4">
            <div class="card shadow auth-card">
              <div class="card-body p-4">
                <h1 class="h4 text-center mb-4 page-title">Register</h1>
                
                <!-- Loading indicator -->
                <div id="loadingIndicator" class="text-center mb-4 d-none">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>

                <form id="registerForm" class="needs-validation" novalidate>
                  <div class="mb-3">
                    <label for="name" class="form-label">Name</label>
                    <input type="text" class="form-control" id="name" required minlength="3" autocomplete="name">
                    <div class="invalid-feedback">Please enter your name (min. 3 characters).</div>
                  </div>
                  <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" required autocomplete="email">
                    <div class="invalid-feedback">Please enter a valid email.</div>
                  </div>
                  <div class="mb-4">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" required minlength="6" autocomplete="new-password">
                    <div class="invalid-feedback">Password must be at least 6 characters.</div>
                  </div>
                  <div class="d-grid gap-2">
                    <button type="submit" class="btn btn-primary">Register</button>
                  </div>
                </form>

                <hr class="my-4">
                
                <div class="text-center">
                  <p class="text-muted mb-3">Already have an account?</p>
                  <a href="#/login" class="btn btn-outline-primary">Login</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.form = document.querySelector('#registerForm');
    this.loadingIndicator = document.querySelector('#loadingIndicator');
    this.nameInput = document.querySelector('#name');
    this.emailInput = document.querySelector('#email');
    this.passwordInput = document.querySelector('#password');

    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (this.form.checkValidity()) {
        if (this.presenter) {
          await this.presenter.handleRegister({
            name: this.nameInput.value,
            email: this.emailInput.value,
            password: this.passwordInput.value
          });
        }
      } else {
        e.stopPropagation();
        this.form.classList.add('was-validated');
      }
    });
  }

  setPresenter(presenter) {
    this.presenter = presenter;
  }

  showLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.classList.remove('d-none');
    }
  }

  hideLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.classList.add('d-none');
    }
  }

  showError(message) {
    window.Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message
    });
  }

  showSuccess(message) {
    window.Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      window.location.hash = '#/login';
    });
  }

  clearForm() {
    this.form.reset();
    this.form.classList.remove('was-validated');
  }
}

export default RegisterView; 