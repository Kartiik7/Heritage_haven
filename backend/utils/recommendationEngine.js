const { TfIdf } = require('natural');
const { getDistance } = require('./distance');
const HeritageSite = require('../models/HeritageSite');
const Post = require('../models/Post');
const User = require('../models/User');

let sites = [];
let tfidf;

// Initialize and train the model with site data
async function initializeModel() {
    sites = await HeritageSite.find({});
    tfidf = new TfIdf();
    
    sites.forEach(site => {
        const featureString = `${site.name} ${site.type} ${site.location} ${site.era} ${site.tags.join(' ')}`;
        tfidf.addDocument(featureString);
    });
    console.log('✅ Recommendation model initialized.');
}

// Get recommendations based on a single site
function getContentBasedRecommendations(siteId, n = 5, userLat = null, userLon = null) {
    const targetSiteIndex = sites.findIndex(site => site.site_id === siteId);
    if (targetSiteIndex === -1) return [];

    const featureString = `${sites[targetSiteIndex].name} ${sites[targetSiteIndex].type} ${sites[targetSiteIndex].location} ${sites[targetSiteIndex].era} ${sites[targetSiteIndex].tags.join(' ')}`;

    const scores = [];
    tfidf.tfidfs(featureString, (i, measure) => {
        const site = sites[i];
        let proximityScore = 0;
        
        // Add proximity scoring if user location is provided
        if (userLat && userLon && site.geotag) {
            const distance = getDistance(userLat, userLon, site.geotag.latitude, site.geotag.longitude);
            // Simple scoring: higher score for closer sites. Max distance of 2000km for relevance.
            proximityScore = Math.max(0, 1 - (distance / 2000)); 
        }

        // Hybrid Score: 70% content similarity, 30% proximity (if location provided)
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

// Get recommendations personalized for a user
async function getPersonalizedRecommendations(userId, userLat, userLon, n = 10) {
    const user = await User.findById(userId);
    if (!user) return [];

    // Create a user profile string from search history and visited sites
    const visitedSiteDocs = await HeritageSite.find({ '_id': { $in: user.visitedSites.map(v => v.site) } });
    const visitedTags = visitedSiteDocs.map(s => s.tags.join(' ')).join(' ');
    const userProfileString = `${user.searchHistory.join(' ')} ${visitedTags}`;
    
    if (userProfileString.trim() === '') {
        // For new users, return popular posts or sites as a fallback (not implemented here)
        return [];
    }

    const scores = [];
    tfidf.tfidfs(userProfileString, (i, measure) => {
        const site = sites[i];
        let proximityScore = 0;
        if (userLat && userLon && site.geotag) {
            const distance = getDistance(userLat, userLon, site.geotag.latitude, site.geotag.longitude);
            // Simple scoring: higher score for closer sites. Max distance of 2000km for relevance.
            proximityScore = Math.max(0, 1 - (distance / 2000)); 
        }

        // Hybrid Score: 70% content, 30% proximity
        const finalScore = (measure * 0.7) + (proximityScore * 0.3);
        scores.push({ site, score: finalScore });
    });

    scores.sort((a, b) => b.score - a.score);
    
    return scores.slice(0, n).map(item => item.site);
}


module.exports = { 
    initializeModel, 
    getContentBasedRecommendations,
    getPersonalizedRecommendations 
};
