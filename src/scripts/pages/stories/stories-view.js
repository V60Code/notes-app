class StoriesView {
  constructor() {
    this.presenter = null;
  }

  async render() {
    this._initializeContent();
    return this;
  }

  async afterRender() {
    // Any additional setup after render can go here
    if (this.presenter) {
      await this.presenter._initialize();
    }
  }

  _createStoryCard(story) {
    return `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card h-100 story-card" style="view-transition-name: story-${story.id}">
          <img 
            src="${story.photoUrl}" 
            class="card-img-top" 
            alt="${story.description}"
            style="height: 200px; object-fit: cover;"
          >
          <div class="card-body">
            <h5 class="card-title">${story.name}</h5>
            <p class="card-text text-truncate">${story.description}</p>
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">${new Date(story.createdAt).toLocaleDateString()}</small>
              <a href="#/stories/${story.id}" class="btn btn-primary btn-sm">Read More</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _initializeContent() {
    const mainContent = document.querySelector('#mainContent');
    if (!mainContent) {
      console.error('Main content element not found');
      return;
    }

    mainContent.innerHTML = `
      <div class="container py-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="page-title">Stories</h1>
          <a href="#/add" class="btn btn-primary">Add New Story</a>
        </div>
        
        <!-- Loading indicator -->
        <div id="loadingIndicator" class="text-center mb-4 d-none">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div id="storiesContainer" class="row g-4">
          <!-- Stories will be rendered here -->
        </div>
      </div>
    `;

    this.loadingIndicator = document.querySelector('#loadingIndicator');
    this.storiesContainer = document.querySelector('#storiesContainer');
  }

  setPresenter(presenter) {
    this.presenter = presenter;
    return this;
  }

  showLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.classList.remove('d-none');
    }
    if (this.storiesContainer) {
      this.storiesContainer.classList.add('d-none');
    }
  }

  hideLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.classList.add('d-none');
    }
    if (this.storiesContainer) {
      this.storiesContainer.classList.remove('d-none');
    }
  }

  showError(message) {
    if (!this.storiesContainer) return;

    this.storiesContainer.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger">
          ${message}
        </div>
      </div>
    `;
  }

  displayStories(stories) {
    if (!this.storiesContainer) return;

    if (!stories.length) {
      this.storiesContainer.innerHTML = `
        <div class="col-12">
          <div class="alert alert-info">
            No stories found. Be the first to share your story!
          </div>
        </div>
      `;
      return;
    }

    this.storiesContainer.innerHTML = stories.map(story => this._createStoryCard(story)).join('');
  }
}

export default StoriesView; 