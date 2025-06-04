class StoriesPresenter {
  constructor({ view, storyService }) {
    this.view = view;
    this.storyService = storyService;
    this.view.setPresenter(this);
  }

  async _initialize() {
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.hash = '#/login';
        return;
      }

      this.view.showLoading();
      const stories = await this.storyService.getStories();
      
      if (!stories || stories.length === 0) {
        console.log('No stories found');
      }
      
      this.view.displayStories(stories);
    } catch (error) {
      console.error('Error loading stories:', error);
      this.view.showError(error.message || 'Failed to load stories. Please try again later.');
    } finally {
      this.view.hideLoading();
    }
  }

  async refreshStories() {
    await this._initialize();
  }
}

export default StoriesPresenter; 