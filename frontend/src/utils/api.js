// API utility functions for Heritage Haven frontend

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Fetch all heritage sites from the backend
 * @returns {Promise<Array>} Array of heritage sites
 */
export const fetchHeritageSites = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/sites`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch heritage sites: ${response.status} ${response.statusText}`);
    }
    
    const sites = await response.json();
    return sites;
  } catch (error) {
    console.error('Error fetching heritage sites:', error);
    throw error;
  }
};

/**
 * Fetch a specific heritage site by its ID
 * @param {string} siteId - The site ID (e.g., "H001")
 * @returns {Promise<Object>} Heritage site object
 */
export const fetchHeritageSiteById = async (siteId) => {
  try {
    const sites = await fetchHeritageSites();
    const site = sites.find(s => s.site_id === siteId);
    
    if (!site) {
      throw new Error(`Heritage site with ID ${siteId} not found`);
    }
    
    return site;
  } catch (error) {
    console.error(`Error fetching heritage site ${siteId}:`, error);
    throw error;
  }
};

/**
 * Track a user visit to a heritage site
 * @param {string} siteId - The site ID
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Response from the API
 */
export const trackSiteVisit = async (siteId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sites/${siteId}/visit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to track visit: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error tracking site visit:', error);
    throw error;
  }
};

/**
 * Get recommendations for a specific site
 * @param {string} siteId - The site ID
 * @returns {Promise<Array>} Array of recommended sites
 */
export const fetchSiteRecommendations = async (siteId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sites/${siteId}/recommendations`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch recommendations: ${response.status} ${response.statusText}`);
    }
    
    const recommendations = await response.json();
    return recommendations;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};

/**
 * Get personalized recommendations for the home page
 * @param {number} limit - Maximum number of recommendations to return (default: 10)
 * @returns {Promise<Array>} Array of recommended heritage sites
 */
export const fetchHomeRecommendations = async (limit = 10) => {
  try {
    // For now, we'll fetch all sites and return a random selection
    // In a real implementation, this would be based on user preferences, history, etc.
    const allSites = await fetchHeritageSites();
    
    // Shuffle the array and take the first 'limit' items
    const shuffled = allSites.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  } catch (error) {
    console.error('Error fetching home recommendations:', error);
    throw error;
  }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.username - Username
 * @param {string} userData.email - Email address
 * @param {string} userData.password - Password
 * @returns {Promise<Object>} User data with token
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

/**
 * Login user
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.email - Email address
 * @param {string} credentials.password - Password
 * @returns {Promise<Object>} User data with token
 */
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};

/**
 * Get user profile
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} User profile data
 */
export const getUserProfile = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user profile');
    }

    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};