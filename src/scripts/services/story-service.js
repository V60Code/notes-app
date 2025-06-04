class StoryService {
  constructor() {
    this._baseUrl = 'https://story-api.dicoding.dev/v1';
  }

  async getStories() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this._baseUrl}/stories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch stories');
      }

      return data.listStory;
    } catch (error) {
      console.error('Error fetching stories:', error);
      throw error;
    }
  }

  async getStoryById(id) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this._baseUrl}/stories/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch story details');
      }

      return data.story;
    } catch (error) {
      console.error('Error fetching story details:', error);
      throw error;
    }
  }

  async addStory(formData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this._baseUrl}/stories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add story');
      }

      return data;
    } catch (error) {
      console.error('Error adding story:', error);
      throw error;
    }
  }
}

export default StoryService; 