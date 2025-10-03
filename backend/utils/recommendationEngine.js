const { TfIdf } = require('natural');
const { getDistance } = require('./distance');
const HeritageSite = require('../models/HeritageSite');
const User = require('../models/User');

let sites = [];
let tfidf;

async function initializeModel() {
  try {
    sites = await HeritageSite.find({}).lean(); // Use .lean() for performance
    tfidf = new TfIdf();
    
    if (sites.length === 0) {
      console.warn('⚠️ No sites found in the database to initialize the recommendation model.');
      return;
    }

    sites.forEach(site => {
      const featureString = `${site.name} ${site.type} ${site.location} ${site.era} ${site.tags.join(' ')}`;
      tfidf.addDocument(featureString);
    });
    console.log(`✅ Recommendation model initialized with ${sites.length} sites.`);
  } catch (error) {
    console.error('❌ Error initializing recommendation model:', error);
  }
}

function getContentBasedRecommendations(siteId, n = 5, userLat = null, userLon = null) {
  // --- DEBUG LOG 1: Announce the start of the function ---
  console.log(`\n[DEBUG] Getting content recommendations for siteId: "${siteId}"`);

  if (sites.length === 0) {
    console.error("[DEBUG] ERROR: The 'sites' array is empty. Model may not be initialized.");
    return [];
  }

  // --- DEBUG LOG 2: Find the site in the array ---
  const targetSiteIndex = sites.findIndex(site => site.site_id === siteId);
  console.log(`[DEBUG] Index found for siteId "${siteId}": ${targetSiteIndex}`);

  if (targetSiteIndex === -1) {
    console.error(`[DEBUG] FAILURE: Could not find any site with site_id === "${siteId}". Returning empty array.`);
    return [];
  }

  const targetSite = sites[targetSiteIndex];
  const featureString = `${targetSite.name} ${targetSite.type} ${targetSite.location} ${targetSite.era} ${targetSite.tags.join(' ')}`;

  const scores = [];
  tfidf.tfidfs(featureString, (i, measure) => {
    const site = sites[i];
    let proximityScore = 0;
    
    if (userLat && userLon && site.geotag) {
      const distance = getDistance(userLat, userLon, site.geotag.latitude, site.geotag.longitude);
      proximityScore = Math.max(0, 1 - (distance / 2000)); 
    }

    const finalScore = userLat && userLon ? (measure * 0.7) + (proximityScore * 0.3) : measure;
    scores.push({ index: i, site_id: site.site_id, score: finalScore });
  });
  
  scores.sort((a, b) => b.score - a.score);

  // --- DEBUG LOG 3: Show the top scores after sorting ---
  console.log('[DEBUG] Top 5 scores after sorting:', scores.slice(0, 6));

  const recommendations = scores
    .filter(item => item.index !== targetSiteIndex)
    .slice(0, n)
    .map(item => sites[item.index]);

  // --- DEBUG LOG 4: Announce the final result ---
  console.log(`[DEBUG] Found ${recommendations.length} recommendations to return.`);

  return recommendations;
}

async function getPersonalizedRecommendations(userId, userLat, userLon, n = 10) {
    const user = await User.findById(userId).lean();
    if (!user) return [];

    const visitedSiteDocs = await HeritageSite.find({ '_id': { $in: user.visitedSites.map(v => v.site) } }).lean();
    const visitedTags = visitedSiteDocs.map(s => s.tags.join(' ')).join(' ');
    const userProfileString = `${user.searchHistory.join(' ')} ${visitedTags}`;
    
    if (userProfileString.trim() === '') {
        return [];
    }

    const scores = [];
    tfidf.tfidfs(userProfileString, (i, measure) => {
        const site = sites[i];
        let proximityScore = 0;
        if (userLat && userLon && site.geotag) {
            const distance = getDistance(userLat, userLon, site.geotag.latitude, site.geotag.longitude);
            proximityScore = Math.max(0, 1 - (distance / 2000)); 
        }

        const finalScore = (measure * 0.7) + (proximityScore * 0.3);
        scores.push({ site, score: finalScore });
    });

    scores.sort((a, b) => b.score - a.score);
    
    const userVisitedMongoIds = new Set(user.visitedSites.map(v => v.site.toString()));
    
    const finalRecommendations = scores
        .filter(item => !userVisitedMongoIds.has(item.site._id.toString()))
        .slice(0, n)
        .map(item => item.site);

    return finalRecommendations;
}

module.exports = { 
    initializeModel, 
    getContentBasedRecommendations,
    getPersonalizedRecommendations 
};

