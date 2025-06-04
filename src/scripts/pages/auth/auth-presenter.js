class AuthPresenter {
  constructor({ view, authService }) {
    this.view = view;
    this.authService = authService;

    // Wait for view to be ready
    if (this.view) {
      this.view.setPresenter(this);
    } else {
      console.error('View is not initialized');
    }
  }

  async handleLogin(loginData) {
    try {
      // Always show loading first
      this.view.showLoading();

      // Validate input
      if (!loginData.email || !loginData.password) {
        throw new Error('Please fill in all fields');
      }

      const response = await this.authService.login(loginData);
      
      // Verify we have a token
      if (!response || !response.token) {
        throw new Error('Invalid login response');
      }
      
      // Show success message
      await window.Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Login successful!',
        timer: 1500,
        showConfirmButton: false
      });

      // Clear the form
      this.view.clearForm();

      // Redirect to home and force reload to ensure navbar is rendered
      window.location.hash = '#/';
      window.location.reload();
    } catch (error) {
      console.error('Login error:', error);
      this.view.showError(error.message || 'Failed to login. Please check your credentials and try again.');
    } finally {
      this.view.hideLoading();
    }
  }

  async handleRegister(name, email, password) {
    try {
      this.view.showLoading();
      await this.model.register(name, email, password);
      this.view.showSuccess('Registration successful! Please login.');
      this.view.switchToLogin();
    } catch (error) {
      this.view.showError(error.message);
    } finally {
      this.view.hideLoading();
    }
  }

  handleLogout() {
    this.model.logout();
    window.location.href = '/login.html';
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password) {
    return password && password.length >= 6;
  }

  // Expose view for rendering
  getView() {
    return this.view;
  }
}

export default AuthPresenter; 