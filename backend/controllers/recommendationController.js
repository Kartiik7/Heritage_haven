const { getContentBasedRecommendations, getPersonalizedRecommendations } = require('../utils/recommendationEngine');

exports.getRecommendationsForSite = (req, res) => {
    try {
        const { siteId } = req.params;
        const { lat, lon } = req.query; // Extract location parameters
        
        const recommendations = getContentBasedRecommendations(siteId, 5, lat, lon);
        res.json(recommendations);
    } catch (error) {
        console.error('Error getting recommendations for site:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getPersonalizedForUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const { lat, lon } = req.query; // User's location from frontend
        
        const recommendations = await getPersonalizedRecommendations(userId, lat, lon, 10);
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
