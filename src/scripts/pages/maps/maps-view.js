import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

class MapsView {
  constructor() {
    console.log('MapsView constructor called');
    this.presenter = null;
    this.map = null;
    this.markers = [];
  }

  async render() {
    console.log('Creating initial elements...');
    this._createInitialElements();
    return this;
  }

  async afterRender() {
    console.log('Initializing map...');
    this._initializeMap();
    if (this.presenter) {
      await this.presenter.init();
    }
  }

  _createInitialElements() {
    const mainContent = document.querySelector('#mainContent');
    if (!mainContent) {
      console.error('Main content element not found');
      return;
    }

    mainContent.innerHTML = `
      <div class="maps-page">
        <div class="container-fluid px-4 py-3">
          <!-- Header -->
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h1 class="h4 mb-0 page-title">Story Locations</h1>
          </div>

          <!-- Map Card -->
          <div class="card shadow-sm">
            <div class="card-body p-0">
              <!-- Loading indicator -->
              <div id="loadingIndicator" class="text-center py-4 d-none">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <!-- Map Container -->
              <div id="map" class="map-container"></div>

              <!-- Controls -->
              <div class="map-controls p-3 border-top">
                <div class="row align-items-center">
                  <div class="col-md-6 mb-3 mb-md-0">
                    <div class="btn-group w-100">
                      <button id="refreshMapBtn" class="btn btn-outline-primary">
                        <i class="bi bi-arrow-clockwise"></i> Refresh Map
                      </button>
                      <button id="centerMapBtn" class="btn btn-outline-secondary">
                        <i class="bi bi-geo-alt"></i> Center Map
                      </button>
                    </div>
                  </div>
                  <div class="col-md-6 text-md-end">
                    <button id="addStoryBtn" class="btn btn-primary w-100 w-md-auto">
                      <i class="bi bi-plus-lg"></i> Add New Story
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add custom styles
    const style = document.createElement('style');
    style.textContent = `
      .maps-page {
        min-height: calc(100vh - 56px);
        background-color: #f8f9fa;
      }
      .map-container {
        height: calc(100vh - 250px);
        min-height: 400px;
        width: 100%;
        z-index: 1;
      }
      .map-controls {
        background-color: #fff;
      }
      @media (max-width: 768px) {
        .map-container {
          height: calc(100vh - 200px);
          min-height: 300px;
        }
        .w-md-auto {
          width: 100% !important;
        }
      }
    `;
    document.head.appendChild(style);

    console.log('Getting DOM elements...');
    this.mapContainer = document.querySelector('#map');
    this.loadingIndicator = document.querySelector('#loadingIndicator');
    this.refreshMapBtn = document.querySelector('#refreshMapBtn');
    this.centerMapBtn = document.querySelector('#centerMapBtn');
    this.addStoryBtn = document.querySelector('#addStoryBtn');

    this._initializeButtons();
  }

  _initializeMap() {
    try {
      if (!this.mapContainer) {
        console.error('Map container not found');
        return;
      }

      console.log('Creating map instance...');
      // Initialize the map centered on Indonesia
      this.map = L.map(this.mapContainer, {
        center: [-2.5489, 118.0149],
        zoom: 5,
        minZoom: 3,
        maxZoom: 18,
        zoomControl: true,
        scrollWheelZoom: true
      });

      // Define tile layers
      const tileLayers = {
        'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }),
        'Satellite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: '© Esri'
        }),
        'Terrain': L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png', {
          attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>'
        }),
        'Dark Mode': L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '© CARTO'
        })
      };

      // Add default layer
      tileLayers['OpenStreetMap'].addTo(this.map);

      // Add layer control
      L.control.layers(tileLayers, null, {
        position: 'topright',
        collapsed: false
      }).addTo(this.map);

      // Initialize markers array
      this.markers = [];

      // Add scale control
      L.control.scale().addTo(this.map);

      // Force a resize to fix the map display
      setTimeout(() => {
        console.log('Resizing map...');
        this.map.invalidateSize();
      }, 100);

      console.log('Map initialized successfully');
    } catch (error) {
      console.error('Error initializing map:', error);
      if (this.mapContainer) {
        this.mapContainer.innerHTML = `
          <div class="alert alert-warning m-3">
            <i class="bi bi-exclamation-triangle me-2"></i>
            Map functionality is currently unavailable.
          </div>
        `;
      }
    }
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
    window.Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
    });
  }

  displayStories(stories) {
    console.log('Displaying stories on map:', stories);
    if (!this.map) {
      console.error('Map is not initialized');
      return;
    }

    // Clear existing markers
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    if (!stories || stories.length === 0) {
      this.showError('No stories with location found');
      return;
    }

    // Add markers for each story
    stories.forEach(story => {
      try {
        const lat = parseFloat(story.lat);
        const lng = parseFloat(story.lon);

        if (isNaN(lat) || isNaN(lng)) {
          console.warn('Invalid coordinates for story:', story.id);
          return;
        }

        const marker = L.marker([lat, lng])
          .addTo(this.map)
          .bindPopup(`
            <div class="story-popup">
              <h6 class="mb-2">${story.name}</h6>
              <img src="${story.photoUrl}" alt="Story" class="img-fluid rounded mb-2" style="max-height: 150px;">
              <p class="mb-0 small">${story.description}</p>
            </div>
          `);

        this.markers.push(marker);
      } catch (error) {
        console.error('Error adding marker for story:', story.id, error);
      }
    });

    // Fit map bounds to show all markers
    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  _initializeButtons() {
    console.log('Initializing buttons...');
    // Refresh Map button
    if (this.refreshMapBtn) {
      this.refreshMapBtn.addEventListener('click', () => {
        console.log('Refresh map clicked');
        if (this.presenter) {
          this.presenter.loadStories();
        }
      });
    } else {
      console.warn('Refresh map button not found');
    }

    // Center Map button
    if (this.centerMapBtn) {
      this.centerMapBtn.addEventListener('click', () => {
        console.log('Center map clicked');
        if (this.map && this.markers.length > 0) {
          const bounds = L.featureGroup(this.markers).getBounds();
          this.map.fitBounds(bounds);
        }
      });
    } else {
      console.warn('Center map button not found');
    }

    // Add Story button
    if (this.addStoryBtn) {
      this.addStoryBtn.addEventListener('click', () => {
        console.log('Add story clicked');
        window.location.hash = '#/add';
      });
    } else {
      console.warn('Add story button not found');
    }
  }
}

export default MapsView; 