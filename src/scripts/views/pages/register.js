const Register = {
  async render() {
    return `
      <div class="auth-container">
        <h2>Register</h2>
        <form id="registerForm">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
          </div>
          <button type="submit">Register</button>
          <p>Already have an account? <a href="#/login">Login here</a></p>
        </form>
      </div>
    `;
  },

  async afterRender() {
    // Registration form handling will be added here
  },
};

export default Register; 