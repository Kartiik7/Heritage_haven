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