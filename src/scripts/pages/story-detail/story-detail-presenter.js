class StoryDetailPresenter {
  constructor({ view, storyService, storyId }) {
    this.view = view;
    this.storyService = storyService;
    this.storyId = storyId;

    this.view.setPresenter(this);
    this._initialize();
  }

  async _initialize() {
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.hash = '#/login';
        return;
      }

      await this.loadStoryDetail();
    } catch (error) {
      console.error('Error initializing story detail:', error);
      this.view.showError(error.message || 'Failed to load story detail');
    }
  }

  async loadStoryDetail() {
    try {
      this.view.showLoading();
      const story = await this.storyService.getStoryById(this.storyId);
      
      if (!story) {
        throw new Error('Story not found');
      }

      this.view.displayStory(story);
    } catch (error) {
      console.error('Error loading story detail:', error);
      this.view.showError(error.message || 'Failed to load story detail');
    } finally {
      this.view.hideLoading();
    }
  }

  handleBackToList() {
    window.location.href = '/';
  }
}

export default StoryDetailPresenter; 