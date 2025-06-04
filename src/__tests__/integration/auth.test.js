import { screen, fireEvent, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

describe('Auth Integration Tests', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `
      <form id="loginForm">
        <div class="form-group">
          <label for="login-email">Email</label>
          <input type="email" id="login-email" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="login-password">Password</label>
          <input type="password" id="login-password" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
        <div id="loading-indicator" class="d-none">Loading...</div>
        <div id="error-message" class="alert alert-danger d-none"></div>
      </form>
    `;
    document.body.appendChild(container);

    // Add form submit handler
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      
      try {
        const response = await fetch('/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token);
        }
      } catch (error) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('d-none');
      }
    });
  });

  afterEach(() => {
    document.body.removeChild(container);
    jest.clearAllMocks();
  });

  test('should handle successful login', async () => {
    // Mock successful API response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'fake-token' }),
      })
    );

    // Get form elements
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const loginButton = screen.getByText('Login');
    const loadingIndicator = document.getElementById('loading-indicator');

    // Simulate user input
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Remove d-none class before clicking
    loadingIndicator.classList.remove('d-none');
    
    // Submit form
    fireEvent.submit(document.getElementById('loginForm'));

    // Wait for API call to complete
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/login',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
          }),
        })
      );
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fake-token');
    });
  });

  test('should show error on login failure', async () => {
    // Mock failed API response
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Invalid credentials'))
    );

    // Get form elements
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const errorMessage = document.getElementById('error-message');

    // Simulate user input
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });

    // Submit form
    fireEvent.submit(document.getElementById('loginForm'));

    // Wait for error message
    await waitFor(() => {
      expect(errorMessage).not.toHaveClass('d-none');
      expect(errorMessage.textContent).toBe('Invalid credentials');
    });
  });
}); 