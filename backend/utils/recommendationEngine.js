const { TfIdf } = require('natural');
const { getDistance } = require('./distance');
const HeritageSite = require('../models/HeritageSite');
const User = require('../models/User');

let sites = [];
let tfidf;

/**
 * Initializes the recommendation model by loading site data from MongoDB 
 * and training the TF-IDF model in memory.
 */
async function initializeModel() {
    try {
        sites = await HeritageSite.find({}).lean(); // Use .lean() for faster read-only operations
        if (sites.length === 0) {
            console.warn('⚠️ No heritage sites found in the database to initialize the model.');
            return;
        }

        tfidf = new TfIdf();
        
        sites.forEach(site => {
            // Note: Ensure your HeritageSite model has these fields.
            const featureString = `${site.name} ${site.type || ''} ${site.location || ''} ${site.era || ''} ${site.tags.join(' ')}`;
            tfidf.addDocument(featureString);
        });

        console.log(`✅ Recommendation model initialized with ${sites.length} sites.`);
    } catch (error) {
        console.error('❌ Error initializing recommendation model:', error);
    }
}

/**
 * Gets recommendations based on similarity to a single site.
 * @param {string} siteId - The _id of the site to get recommendations for.
 * @param {number} n - The number of recommendations to return.
 * @param {number|null} userLat - The user's latitude.
 * @param {number|null} userLon - The user's longitude.
 * @returns {Array} An array of recommended site objects.
 */
function getContentBasedRecommendations(siteId, n = 5, userLat = null, userLon = null) {
    const targetSiteIndex = sites.findIndex(site => site._id.toString() === siteId);
    if (targetSiteIndex === -1) return [];

    const siteToMatch = sites[targetSiteIndex];
    const featureString = `${siteToMatch.name} ${siteToMatch.type || ''} ${siteToMatch.location || ''} ${siteToMatch.era || ''} ${siteToMatch.tags.join(' ')}`;

    const scores = [];
    tfidf.tfidfs(featureString, (i, measure) => {
        const site = sites[i];
        let proximityScore = 0;
        
        if (userLat && userLon && site.geotag && site.geotag.latitude && site.geotag.longitude) {
            const distance = getDistance(userLat, userLon, site.geotag.latitude, site.geotag.longitude);
            proximityScore = Math.max(0, 1 - (distance / 2000)); // Normalize distance
        }

        const finalScore = userLat && userLon ? 
            (measure * 0.7) + (proximityScore * 0.3) : 
            measure;
            
        scores.push({ index: i, score: finalScore });
    });
    
    scores.sort((a, b) => b.score - a.score);

    return scores
        .filter(item => item.index !== targetSiteIndex)
        .slice(0, n)
        .map(item => sites[item.index]);
}


/**
 * Generates recommendations for a user based on their history and location.
 * @param {string} userId - The ID of the user.
 * @param {number|null} userLat - The user's latitude.
 * @param {number|null} userLon - The user's longitude.
 * @param {number} n - The number of recommendations to return.
 * @returns {Array} An array of recommended site objects.
 */
async function getPersonalizedRecommendations(userId, userLat, userLon, n = 10) {
    const user = await User.findById(userId).lean();
    if (!user) return [];

    // --- 1. Create User Profile ---
    const visitedSiteIds = user.visitedSites.map(v => v.site.toString());
    const visitedSiteDocs = sites.filter(site => visitedSiteIds.includes(site._id.toString()));
    const visitedTags = visitedSiteDocs.map(s => s.tags.join(' ')).join(' ');
    
    const userProfileString = `${user.searchHistory.join(' ')} ${visitedTags}`;
    
    console.log(`[REC ENGINE] User Profile for ${user.username}: "${userProfileString}"`);

    if (userProfileString.trim() === '') {
        console.log('[REC ENGINE] User profile is empty. Cannot generate personalized recommendations.');
        // FUTURE: Return popular sites as a fallback here.
        return [];
    }

    // --- 2. Calculate Scores ---
    const scores = [];
    tfidf.tfidfs(userProfileString, (i, measure) => {
        const site = sites[i];
        let proximityScore = 0;

        if (userLat && userLon && site.geotag && site.geotag.latitude && site.geotag.longitude) {
            const distance = getDistance(userLat, userLon, site.geotag.latitude, site.geotag.longitude);
            proximityScore = Math.max(0, 1 - (distance / 2000)); // Normalize distance to a score
        }
        
        // Hybrid Score: 70% content, 30% proximity
        const finalScore = (measure * 0.7) + (proximityScore * 0.3);
        scores.push({ site, score: finalScore });
    });

    // --- 3. Filter and Sort ---
    const recommendedSites = scores
        // CRITICAL FIX: Filter out sites the user has already visited.
        .filter(item => !visitedSiteIds.includes(item.site._id.toString()))
        .sort((a, b) => b.score - a.score);

    console.log('[REC ENGINE] Top 3 scores:', recommendedSites.slice(0, 3).map(s => ({ name: s.site.name, score: s.score })));
    
    return recommendedSites.slice(0, n).map(item => item.site);
}

module.exports = { 
    initializeModel, 
    getContentBasedRecommendations,
    getPersonalizedRecommendations 
};

