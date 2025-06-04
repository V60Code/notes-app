class StoryDetailModel {
  constructor() {
    this.baseUrl = 'https://story-api.dicoding.dev/v1';
  }

  async getStoryById(id) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseUrl}/stories/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch story details');
      }

      if (!data.story) {
        throw new Error('Story not found');
      }

      return data.story;
    } catch (error) {
      if (error.message === 'Story not found') {
        throw error;
      }
      throw new Error(`Failed to fetch story details: ${error.message}`);
    }
  }
}

export default StoryDetailModel; 