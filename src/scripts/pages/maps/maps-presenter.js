class MapsPresenter {
  constructor({ view, storyService }) {
    this.view = view;
    this.storyService = storyService;
    console.log('MapsPresenter initialized with:', { view, storyService });
    this.view.setPresenter(this);
  }

  async init() {
    try {
      console.log('Initializing MapsPresenter...');
      await this.loadStories();
    } catch (error) {
      console.error('Error initializing maps:', error);
      if (this.view) {
        this.view.showError('Failed to load stories. Please try again later.');
      }
    }
  }

  async loadStories() {
    try {
      console.log('Loading stories...');
      if (this.view) {
        this.view.showLoading();
      }

      const stories = await this.storyService.getStories();
      console.log('Stories loaded:', stories);
      
      // Filter stories that have location data
      const storiesWithLocation = stories.filter(story => 
        story.lat && story.lon && 
        !isNaN(parseFloat(story.lat)) && !isNaN(parseFloat(story.lon))
      );
      console.log('Stories with location:', storiesWithLocation);

      if (this.view) {
        this.view.displayStories(storiesWithLocation);
      }
    } catch (error) {
      console.error('Error loading stories:', error);
      if (this.view) {
        this.view.showError('Failed to load stories. Please try again later.');
      }
    } finally {
      if (this.view) {
        this.view.hideLoading();
      }
    }
  }

  async loadStoryDetail(id) {
    try {
      this.view.showLoading();
      const story = await this.model.getStoryDetail(id);
      this.view.displayStoryDetail(story);
    } catch (error) {
      console.error('Error loading story detail:', error);
      this.view.showError('Failed to load story detail. Please try again later.');
    } finally {
      this.view.hideLoading();
    }
  }
}

export default MapsPresenter; 