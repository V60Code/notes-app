const Home = {
  async render() {
    return `
      <div class="content">
        <h2>Home Page</h2>
        <div id="stories" class="stories">
          <!-- Stories will be rendered here -->
        </div>
      </div>
    `;
  },

  async afterRender() {
    // Logic for loading stories will be added here
  },
};

export default Home; 