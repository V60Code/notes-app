class AuthModel {
  constructor() {
    this.baseUrl = 'https://story-api.dicoding.dev/v1';
  }

  async login(loginData) {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message);
      }

      // Store the token in localStorage
      localStorage.setItem('token', responseJson.loginResult.token);
      return responseJson.loginResult;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(name, email, password) {
    try {
      const response = await fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }

      return data;
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  logout() {
    localStorage.removeItem('token');
  }
}

export default AuthModel; 