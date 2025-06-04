class MapsModel {
  constructor() {
    this.baseUrl = 'https://story-api.dicoding.dev/v1';
  }

  getCurrentUserId() {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) return null;

      // Decode JWT token to get user data
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);
      return payload.userId;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  }

  async getAllStories() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${this.baseUrl}/stories?location=1`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message);
      }

      return responseJson.listStory;
    } catch (error) {
      console.error('Error fetching stories:', error);
      throw error;
    }
  }

  async getStoryDetail(id) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${this.baseUrl}/stories/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message);
      }

      return responseJson.story;
    } catch (error) {
      console.error('Error fetching story detail:', error);
      throw error;
    }
  }
}

export default MapsModel; 