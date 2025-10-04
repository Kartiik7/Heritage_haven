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

/**
 * Fetch all posts from the backend
 * @returns {Promise<Array>} Array of posts
 */
export const fetchPosts = async () => {
  try {
    console.log('Fetching posts from:', `${API_BASE_URL}/posts`);
    
    // First, let's try to see if the backend is even running
    try {
      const response = await fetch(`${API_BASE_URL}/posts`);
      
      if (!response.ok) {
        console.warn(`Backend returned ${response.status}: ${response.statusText}`);
        
        // If backend is not available, return empty array instead of mock data
        if (response.status >= 500 || response.status === 404) {
          console.log('Backend not available, returning empty posts array');
          return [];
        }
        
        throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
      }
      
      const posts = await response.json();
      console.log('Fetched posts from backend:', posts.length, 'posts');
      
      // Log each post's ID to identify problematic ones
      posts.forEach((post, index) => {
        const isNumericId = /^\d+$/.test(String(post._id));
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(post._id);
        console.log(`Post ${index}:`, {
          _id: post._id,
          title: post.title,
          idType: typeof post._id,
          idLength: post._id?.length,
          isNumericId,
          isObjectId,
          isValid: isNumericId || isObjectId
        });
      });
      
      return posts;
      
    } catch (fetchError) {
      console.error('Network error fetching posts:', fetchError);
      console.log('Backend appears to be down, returning empty array');
      return [];
    }
    
  } catch (error) {
    console.error('Error in fetchPosts:', error);
    // Return empty array instead of throwing to prevent app crash
    return [];
  }
};

/**
 * Create a new post
 * @param {Object} postData - Post data
 * @param {string} postData.title - Post title
 * @param {string} postData.content - Post content
 * @param {string} postData.imageUrl - Post image URL (optional)
 * @param {Array} postData.tags - Post tags (optional)
 * @param {string} postData.heritageSite - Heritage site ID (optional)
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Created post data
 */
export const createPost = async (postData, token) => {
  try {
    console.log('Creating post with data:', postData);
    
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });

    console.log('Server response status:', response.status);
    
    const data = await response.json();
    console.log('Server response data:', data);

    if (!response.ok) {
      console.error('Create post failed:', {
        status: response.status,
        statusText: response.statusText,
        data
      });
      throw new Error(data.message || 'Server Error');
    }

    return data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

/**
 * Like or unlike a post
 * @param {string} postId - Post ID
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Updated post data
 */
export const likePost = async (postId, token) => {
  try {
    // Validate input parameters
    if (!postId) {
      throw new Error('Post ID is required');
    }
    if (!token) {
      throw new Error('Authentication token is required');
    }

    // Convert numeric IDs to strings for the API call
    const apiPostId = String(postId);
    console.log('Attempting to like post:', apiPostId);
    
    const response = await fetch(`${API_BASE_URL}/posts/${apiPostId}/like`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Server response:', { status: response.status, statusText: response.statusText, data });
      throw new Error(data.message || 'Post not found');
    }

    return data;
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};