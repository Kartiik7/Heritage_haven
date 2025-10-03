const HeritageSite = require('../models/HeritageSite');
const User = require('../models/User');

exports.getAllSites = async (req, res) => {
    try {
        const sites = await HeritageSite.find({});
        res.json(sites);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.logSiteVisit = async (req, res) => {
    try {
        const siteId = req.params.id;
        const userId = req.user._id;

        // Add to user's visitedSites array if not already present recently
        await User.findByIdAndUpdate(userId, {
            $addToSet: { visitedSites: { site: siteId } }
        });

        res.status(200).json({ message: 'Site visit logged successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
