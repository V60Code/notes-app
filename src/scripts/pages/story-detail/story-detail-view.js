import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

class StoryDetailView {
  constructor() {
    this._initializeContent();
    this.presenter = null;
    this.map = null;
  }

  _initializeContent() {
    const mainContent = document.querySelector('#mainContent');
    if (!mainContent) {
      console.error('Main content element not found');
      return;
    }

    mainContent.innerHTML = `
      <div class="container py-5">
        <!-- Back button -->
        <div class="mb-4">
          <a href="#/" class="btn btn-outline-primary">
            <i class="bi bi-arrow-left"></i> Back to Stories
          </a>
        </div>

        <!-- Loading indicator -->
        <div id="loadingIndicator" class="text-center mb-4 d-none">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div id="storyDetailContainer">
          <!-- Story detail will be rendered here -->
        </div>
      </div>
    `;

    this.loadingIndicator = document.querySelector('#loadingIndicator');
    this.storyDetailContainer = document.querySelector('#storyDetailContainer');
  }

  setPresenter(presenter) {
    this.presenter = presenter;
    return this;
  }

  showLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.classList.remove('d-none');
    }
  }

  hideLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.classList.add('d-none');
    }
  }

  showError(message) {
    if (!this.storyDetailContainer) return;

    this.storyDetailContainer.innerHTML = `
      <div class="alert alert-danger">
        ${message}
      </div>
    `;
  }

  initializeMap(lat, lon) {
    if (this.map) {
      this.map.remove();
    }

    const mapContainer = document.getElementById('storyMap');
    if (!mapContainer) return;

    mapContainer.style.display = 'block';
    this.map = L.map('storyMap').setView([lat, lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    L.marker([lat, lon]).addTo(this.map);
  }

  render() {
    // Initial render is handled by constructor
    return Promise.resolve();
  }

  displayStory(story) {
    if (!this.storyDetailContainer) return;

    this.storyDetailContainer.innerHTML = `
      <div class="card story-card" style="view-transition-name: story-${story.id}">
        <div class="row g-0">
          <div class="col-md-8">
            <img 
              src="${story.photoUrl}" 
              class="img-fluid rounded-start w-100 h-100" 
              alt="${story.description}"
              style="object-fit: cover;"
            >
          </div>
          <div class="col-md-4">
            <div class="card-body">
              <h1 class="card-title h2 page-title">${story.name}</h1>
              <p class="card-text">${story.description}</p>
              <p class="card-text">
                <small class="text-muted">Posted on ${new Date(story.createdAt).toLocaleDateString()}</small>
              </p>
              ${story.lat && story.lon ? `
                <div class="mt-3">
                  <h5>Location</h5>
                  <div id="map" class="rounded" style="height: 200px;"></div>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;

    // Initialize map if coordinates are available
    if (story.lat && story.lon && typeof L !== 'undefined') {
      const map = L.map('map').setView([story.lat, story.lon], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      L.marker([story.lat, story.lon]).addTo(map);
    }
  }
}

export default StoryDetailView; 