const NotFound = {
  async render() {
    return `
      <div class="not-found-container">
        <h2>404 - Page Not Found</h2>
        <p>Sorry, the page you are looking for does not exist.</p>
        <a href="#/" class="back-home">Back to Home</a>
      </div>
    `;
  },

  async afterRender() {
    // Add any necessary event listeners
  },
};

export default NotFound; 