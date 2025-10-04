// API utility functions for Heritage Haven frontend

// Get API base URL from environment variables.
// In development, this will be http://localhost:5000 from .env.development
// In production, this will be your backend URL from Render's environment variables.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

/**
 * Get the API base URL for use in other components
 * @returns {string} The API base URL
 */
export const getApiBaseUrl = () => API_BASE_URL;

/**
 * Fetch all heritage sites from the backend
 * @returns {Promise<Array>} Array of heritage sites
 */
export const fetchHeritageSites = async () => {
  try {
    // Correctly uses the API_BASE_URL variable
    const response = await fetch(`${API_BASE_URL}/api/sites`);
    
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
    // This function was making another network call, let's point it to the backend directly
    const response = await fetch(`${API_BASE_URL}/api/sites/${siteId}`);
    if (!response.ok) {
        throw new Error(`Heritage site with ID ${siteId} not found`);
    }
    const site = await response.json();
    return site;
  } catch (error) {
    console.error(`Error fetching heritage site ${siteId}:`, error);
    throw error;
  }
};

// ... (keep the rest of the functions as they are, they all use API_BASE_URL)

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} User data with token
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
 * @returns {Promise<Object>} User data with token
 */
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

// ... (The rest of your api.js file remains the same)
// Ensure all fetch calls use `${API_BASE_URL}/api/...`
export const getUserProfile = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
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

export const fetchPosts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/posts`);
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in fetchPosts:', error);
    return []; // Return empty array to prevent app crash
  }
};

export const createPost = async (postData, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(postData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Server Error');
        }
        return data;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};

export const likePost = async (postId, token) => {
    try {
        const apiPostId = String(postId);
        const response = await fetch(`${API_BASE_URL}/api/posts/${apiPostId}/like`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Post not found');
        }
        return data;
    } catch (error) {
        console.error('Error liking post:', error);
        throw error;
    }
};

/**
 * Fetch quiz questions for a specific monument.
 * @param {string} monumentId - The ID of the monument.
 * @param {string} token - The user's authentication token.
 * @returns {Promise<Array>} An array of quiz questions.
 */
export const fetchQuizQuestions = async (monumentId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/quiz/${monumentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch quiz questions');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    throw error;
  }
};

/**
 * Submit quiz answers for a specific monument.
 * @param {string} monumentId - The ID of the monument.
 * @param {Array} answers - An array of answer objects [{ questionId, chosenIndex }].
 * @param {string} token - The user's authentication token.
 * @returns {Promise<Object>} The result of the quiz submission.
 */
export const submitQuiz = async (monumentId, answers, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/quiz/${monumentId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ answers }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit quiz');
    }
    return await response.json();
  } catch (error) {
    console.error('Error submitting quiz:', error);
    throw error;
  }
};

/**
 * Track a user's visit to a heritage site.
 * @param {string} siteId - The custom ID of the site (e.g., "H041").
 * @param {string} token - The user's authentication token.
 * @returns {Promise<Object>} The server response.
 */
export const trackVisit = async (siteId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sites/${siteId}/visit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to track visit');
    }
    return await response.json();
  } catch (error) {
    console.error('Error tracking visit:', error);
    throw error;
  }
};

/**
 * Fetches content-based recommendations for a given site.
 * @param {string} siteId - The custom ID of the site.
 * @param {number} [lat] - Optional latitude for location-aware recommendations.
 * @param {number} [lon] - Optional longitude for location-aware recommendations.
 * @returns {Promise<Array>} An array of recommended sites.
 */
export const fetchRecommendationsForSite = async (siteId, lat, lon) => {
    try {
        const url = new URL(`${API_BASE_URL}/api/sites/${siteId}/recommendations`);
        if (lat && lon) {
            url.searchParams.append('lat', lat);
            url.searchParams.append('lon', lon);
        }
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch recommendations');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching recommendations for site:', error);
        throw error;
    }
};

/**
 * Fetches personalized recommendations for the logged-in user.
 * @param {string} token - The user's authentication token.
 * @param {number} [lat] - Optional user latitude.
 * @param {number} [lon] - Optional user longitude.
 * @returns {Promise<Array>} An array of recommended sites.
 */
export const fetchPersonalizedRecommendations = async (token, lat, lon) => {
    try {
        const url = new URL(`${API_BASE_URL}/api/recommendations/user`);
        if (lat && lon) {
            url.searchParams.append('lat', lat);
            url.searchParams.append('lon', lon);
        }
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch personalized recommendations');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching personalized recommendations:', error);
        throw error;
    }
};

/**
 * Searches for hotels based on provided criteria.
 * @param {object} params - The search parameters.
 * @param {string} params.city - The city code (e.g., "DEL").
 * @param {string} params.checkInDate - The check-in date (YYYY-MM-DD).
 * @param {string} params.checkOutDate - The check-out date (YYYY-MM-DD).
 * @param {number} [params.adults=1] - The number of adults.
 * @returns {Promise<Object>} The hotel search results.
 */
export const searchHotels = async (params) => {
    try {
        const url = new URL(`${API_BASE_URL}/api/hotels/search`);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to search for hotels');
        }
        return await response.json();
    } catch (error) {
        console.error('Error searching for hotels:', error);
        throw error;
    }
};

/**
 * Fetches nearby tourist attractions from Google Places API via our backend.
 * @param {number} lat - The latitude.
 * @param {number} lon - The longitude.
 * @returns {Promise<Array>} An array of nearby places.
 */
export const fetchNearbyPlaces = async (lat, lon) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/places/nearby?lat=${lat}&lon=${lon}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch nearby places');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching nearby places:', error);
        throw error;
    }
};

/**
 * Fetches recommendations for the home page.
 * If the user is logged in (token provided), it fetches personalized recommendations.
 * Otherwise, it fetches a general list of all heritage sites.
 * @param {string|null} token - The user's authentication token, or null if not logged in.
 * @param {number} [lat] - Optional user latitude.
 * @param {number} [lon] - Optional user longitude.
 * @returns {Promise<Array>} An array of recommended sites.
 */
export const fetchHomeRecommendations = async (token, lat, lon) => {
    if (token) {
        // If logged in, get personalized recommendations
        return fetchPersonalizedRecommendations(token, lat, lon);
    } else {
        // If not logged in, get a general list of all sites as a fallback
        return fetchHeritageSites();
    }
};

