const HeritageSite = require('../models/HeritageSite');
const User = require('../models/User');

/**
 * @desc    Get all heritage sites from the database.
 * @route   GET /api/sites
 * @access  Public
 */
const getAllSites = async (req, res) => {
    try {
        const sites = await HeritageSite.find({});
        res.json(sites);
    } catch (error) {
        console.error('Error fetching sites:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Track that a logged-in user has visited a site.
 * @route   POST /api/sites/:siteId/visit
 * @access  Private
 */
const trackVisit = async (req, res) => {
    try {
        const { siteId } = req.params; // This is the custom ID, e.g., "H005"
        const userId = req.user._id;

        const siteToVisit = await HeritageSite.findOne({ site_id: siteId });

        // Stricter check to ensure the document was found
        if (!siteToVisit || !siteToVisit._id) {
            console.error(`Attempted to track visit for a non-existent siteId: ${siteId}`);
            return res.status(404).json({ message: 'Heritage site not found' });
        }

        const mongoSiteId = siteToVisit._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const alreadyVisited = user.visitedSites.some(
            (visit) => visit.site && visit.site.toString() === mongoSiteId.toString()
        );

        if (!alreadyVisited) {
            // Create the new visit object
            const newVisit = {
                site: mongoSiteId,
                // visitedAt is handled by default in the schema
            };

            // Push the new visit object into the array
            user.visitedSites.push(newVisit);

            // Save the updated user document
            await user.save();

            res.status(201).json({ message: 'Visit tracked successfully', visitedSites: user.visitedSites });
        } else {
            res.status(200).json({ message: 'Visit already tracked' });
        }
    } catch (error) {
        // This will now provide a much more detailed error log in your terminal
        console.error('Error in trackVisit controller:', error);
        res.status(500).json({ message: 'Server Error', details: error.message });
    }
};

// Make sure both functions are exported so they can be imported in other files
module.exports = {
    getAllSites,
    trackVisit,
};


