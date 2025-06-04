class AddStoryModel {
  constructor() {
    this.baseUrl = 'https://story-api.dicoding.dev/v1';
  }

  async postStory(formData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseUrl}/stories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to post story');
      }

      return data;
    } catch (error) {
      throw new Error(`Failed to post story: ${error.message}`);
    }
  }
}

export default AddStoryModel; 