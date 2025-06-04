class RegisterPresenter {
  constructor({ view, authService }) {
    this.view = view;
    this.authService = authService;

    this.view.setPresenter(this);
  }

  async init() {
    if (!this.view) {
      console.error('View is not properly initialized');
      return;
    }
    console.log('RegisterPresenter initialized');
  }

  async handleRegister(registerData) {
    try {
      // Show loading state
      this.view.showLoading();

      // Validate input
      if (!registerData.name || !registerData.email || !registerData.password) {
        throw new Error('Please fill in all fields');
      }

      if (registerData.name.length < 3) {
        throw new Error('Name must be at least 3 characters long');
      }

      if (!this._validateEmail(registerData.email)) {
        throw new Error('Please enter a valid email address');
      }

      if (registerData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Attempt registration
      const response = await this.authService.register(registerData);
      
      // Clear form and show success message
      this.view.clearForm();
      this.view.showSuccess('Registration successful! Please login to continue.');
    } catch (error) {
      console.error('Registration error:', error);
      this.view.showError(error.message || 'Failed to register. Please try again.');
    } finally {
      // Hide loading state
      this.view.hideLoading();
    }
  }

  _validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export default RegisterPresenter; 