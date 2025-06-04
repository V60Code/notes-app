class AddStoryPresenter {
  constructor({ view, storyService }) {
    this.view = view;
    this.storyService = storyService;
    this.view.setPresenter(this);
  }

  async init() {
    if (!this.view) {
      console.error('View is not properly initialized');
      return;
    }
    console.log('AddStoryPresenter initialized');
  }

  async handleAddStory(formData) {
    try {
      // Validate form data
      if (!this.validateFormData(formData)) {
        throw new Error('Please fill in all required fields and upload an image');
      }

      this.view.showLoading();
      await this.storyService.addStory(formData);
      
      // Show success message
      await window.Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Story posted successfully!',
        timer: 1500,
        showConfirmButton: false
      });
      
      this.view.resetForm();
      
      // Redirect to story list page after successful post
      window.location.hash = '#/';
    } catch (error) {
      console.error('Add story error:', error);
      this.view.showError(error.message || 'Failed to post story. Please try again.');
    } finally {
      this.view.hideLoading();
    }
  }

  validateFormData(formData) {
    const description = formData.get('description');
    const photo = formData.get('photo');
    
    return description && description.trim() !== '' && photo && photo.size > 0;
  }
}

export default AddStoryPresenter; 