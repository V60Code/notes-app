const Login = {
  async render() {
    return `
      <div class="auth-container">
        <h2>Login</h2>
        <form id="loginForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
          </div>
          <button type="submit">Login</button>
          <p>Don't have an account? <a href="#/register">Register here</a></p>
        </form>
      </div>
    `;
  },

  async afterRender() {
    // Login form handling will be added here
  },
};

export default Login; 