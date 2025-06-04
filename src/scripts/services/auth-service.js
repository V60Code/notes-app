class AuthService {
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
      localStorage.setItem('userId', responseJson.loginResult.userId);
      localStorage.setItem('name', responseJson.loginResult.name);

      return responseJson.loginResult;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(registerData) {
    try {
      const response = await fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password
        }),
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message);
      }

      return responseJson;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    window.location.hash = '#/login';
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  getCurrentUser() {
    return {
      token: localStorage.getItem('token'),
      userId: localStorage.getItem('userId'),
      name: localStorage.getItem('name'),
    };
  }
}

export default AuthService; 