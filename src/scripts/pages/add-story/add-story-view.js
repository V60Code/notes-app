import Swal from 'sweetalert2';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

class AddStoryView {
  constructor() {
    this.presenter = null;
    this.map = null;
    this.marker = null;
    this.stream = null;
  }

  async render() {
    this._createInitialElements();
    return this;
  }

  async afterRender() {
    // Initialize map after elements are rendered
    setTimeout(() => {
      this._initializeMap();
    }, 100);

    // Add event listeners
    this._initializeEventListeners();

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
      <div class="container py-4">
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="card shadow">
              <div class="card-header bg-white py-3">
                <h1 class="card-title h4 mb-0">Add New Story</h1>
              </div>
              <div class="card-body">
                <!-- Loading indicator -->
                <div id="loadingIndicator" class="text-center mb-4 d-none">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>

                <form id="addStoryForm" class="needs-validation" novalidate>
                  <div class="mb-4">
                    <label for="description" class="form-label">Description</label>
                    <textarea class="form-control" id="description" rows="3" required></textarea>
                    <div class="invalid-feedback">Please provide a description.</div>
                  </div>

                  <div class="mb-4">
                    <label for="photo" class="form-label">Photo</label>
                    <div class="d-flex gap-2 align-items-start">
                      <div class="flex-grow-1">
                        <input type="file" class="form-control" id="photo" accept="image/*" required>
                        <div class="invalid-feedback">Please select a photo.</div>
                      </div>
                      <button type="button" class="btn btn-secondary" id="openCamera">
                        <i class="bi bi-camera"></i> Use Camera
                      </button>
                    </div>
                  </div>

                  <div class="mb-4">
                    <div class="camera-container mt-2 d-none">
                      <video id="cameraPreview" class="w-100 rounded" autoplay playsinline></video>
                      <div class="d-flex gap-2 mt-2">
                        <button type="button" class="btn btn-primary" id="captureButton">
                          <i class="bi bi-camera"></i> Capture
                        </button>
                        <button type="button" class="btn btn-secondary" id="retakeButton">
                          <i class="bi bi-arrow-counterclockwise"></i> Retake
                        </button>
                      </div>
                    </div>
                    <img id="photoPreview" src="" alt="Preview" class="img-fluid d-none rounded mt-2">
                  </div>

                  <div class="mb-4">
                    <label class="form-label d-flex justify-content-between align-items-center">
                      <span>Location (Optional)</span>
                      <button type="button" class="btn btn-sm btn-outline-primary" id="getCurrentLocation">
                        <i class="bi bi-geo-alt"></i> Use Current Location
                      </button>
                    </label>
                    
                    <div class="alert alert-info small mb-2">
                      <i class="bi bi-info-circle me-2"></i>Click on the map to set location or use the button above
                    </div>

                    <div id="map" style="height: 300px; margin-bottom: 1rem;" class="rounded border"></div>
                    
                    <div class="row g-3">
                      <div class="col-md-6">
                        <label for="latitude" class="form-label">Latitude</label>
                        <input type="number" class="form-control" id="latitude" step="any" placeholder="-7.778124">
                      </div>
                      <div class="col-md-6">
                        <label for="longitude" class="form-label">Longitude</label>
                        <input type="number" class="form-control" id="longitude" step="any" placeholder="110.392746">
                      </div>
                    </div>
                  </div>

                  <div class="d-grid gap-2">
                    <button type="submit" class="btn btn-primary">
                      <i class="bi bi-cloud-upload"></i> Submit Story
                    </button>
                    <a href="#/" class="btn btn-secondary">
                      <i class="bi bi-x-circle"></i> Cancel
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Get form elements
    this.form = document.querySelector('#addStoryForm');
    this.descriptionInput = document.querySelector('#description');
    this.photoInput = document.querySelector('#photo');
    this.photoPreview = document.querySelector('#photoPreview');
    this.latitudeInput = document.querySelector('#latitude');
    this.longitudeInput = document.querySelector('#longitude');
    this.getCurrentLocationBtn = document.querySelector('#getCurrentLocation');
    this.loadingIndicator = document.querySelector('#loadingIndicator');
    this.mapContainer = document.querySelector('#map');
    
    // Camera elements
    this.openCameraButton = document.querySelector('#openCamera');
    this.cameraContainer = document.querySelector('.camera-container');
    this.cameraPreview = document.querySelector('#cameraPreview');
    this.captureButton = document.querySelector('#captureButton');
    this.retakeButton = document.querySelector('#retakeButton');
  }

  _initializeMap() {
    try {
      // Initialize the map centered on Indonesia
      this.map = L.map(this.mapContainer).setView([-2.5489, 118.0149], 5);

      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      // Handle map click
      this.map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        this._updateMarker(lat, lng);
        this._updateCoordinateInputs(lat, lng);
      });

      // Force a resize to fix the map display
      setTimeout(() => {
        this.map.invalidateSize();
      }, 0);
    } catch (error) {
      console.error('Error initializing map:', error);
      this.mapContainer.innerHTML = `
        <div class="alert alert-warning">
          <i class="bi bi-exclamation-triangle me-2"></i>
          Map functionality is currently unavailable.
        </div>
      `;
    }
  }

  _initializeEventListeners() {
    // Photo preview
    this.photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.photoPreview.src = e.target.result;
          this.photoPreview.classList.remove('d-none');
        };
        reader.readAsDataURL(file);
      }
    });

    // Camera functionality
    this.openCameraButton.addEventListener('click', () => this._startCamera());
    this.captureButton.addEventListener('click', () => this._capturePhoto());
    this.retakeButton.addEventListener('click', () => this._startCamera());

    // Get current location
    this.getCurrentLocationBtn.addEventListener('click', () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            this._updateMarker(latitude, longitude);
            this._updateCoordinateInputs(latitude, longitude);
            if (this.map) {
              this.map.setView([latitude, longitude], 13);
            }
          },
          (error) => {
            console.error('Geolocation error:', error);
            this.showError('Failed to get your location. Please try again or enter coordinates manually.');
          }
        );
      } else {
        this.showError('Geolocation is not supported by your browser.');
      }
    });

    // Form submission
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (this.form.checkValidity()) {
        await this._handleSubmit();
      }
      this.form.classList.add('was-validated');
    });
  }

  async _startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      this.cameraPreview.srcObject = this.stream;
      this.cameraContainer.classList.remove('d-none');
      this.photoPreview.classList.add('d-none');
    } catch (error) {
      console.error('Camera error:', error);
      this.showError('Could not access camera. Please make sure you have granted camera permissions.');
    }
  }

  _capturePhoto() {
    const canvas = document.createElement('canvas');
    canvas.width = this.cameraPreview.videoWidth;
    canvas.height = this.cameraPreview.videoHeight;
    
    const context = canvas.getContext('2d');
    context.drawImage(this.cameraPreview, 0, 0, canvas.width, canvas.height);
    
    // Convert to file
    canvas.toBlob((blob) => {
      const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
      
      // Update file input
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      this.photoInput.files = dataTransfer.files;
      
      // Show preview
      this.photoPreview.src = URL.createObjectURL(blob);
      this.photoPreview.classList.remove('d-none');
      
      // Stop camera
      this._stopCamera();
    }, 'image/jpeg', 0.8);
  }

  _stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.cameraContainer.classList.add('d-none');
    this.cameraPreview.srcObject = null;
  }

  _updateMarker(lat, lng) {
    if (this.map) {
      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
      } else {
        this.marker = L.marker([lat, lng]).addTo(this.map);
      }
    }
  }

  _updateCoordinateInputs(lat, lng) {
    this.latitudeInput.value = lat;
    this.longitudeInput.value = lng;
  }

  async _handleSubmit() {
    try {
      const formData = new FormData();
      formData.append('description', this.descriptionInput.value);
      formData.append('photo', this.photoInput.files[0]);
      
      if (this.latitudeInput.value && this.longitudeInput.value) {
        formData.append('lat', this.latitudeInput.value);
        formData.append('lon', this.longitudeInput.value);
      }

      await this.presenter.handleAddStory(formData);
    } catch (error) {
      console.error('Submit error:', error);
      this.showError(error.message || 'Failed to add story. Please try again.');
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
    if (this.form) {
      this.form.classList.add('d-none');
    }
  }

  hideLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.classList.add('d-none');
    }
    if (this.form) {
      this.form.classList.remove('d-none');
    }
  }

  showError(message) {
    window.Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
    });
  }

  resetForm() {
    this.form.reset();
    this.form.classList.remove('was-validated');
    this.photoPreview.classList.add('d-none');
    this.photoPreview.src = '';
    this._stopCamera();
    if (this.marker) {
      this.marker.remove();
      this.marker = null;
    }
  }
}

export default AddStoryView; 