const User = require('../models/User');
const Service = require('../models/Service'); // We need this to cache OSM data!

const toggleFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { serviceId, serviceData } = req.body;

        let dbServiceId = serviceId;

        // LAZY-CACHING: If this came from OpenStreetMap (no MongoDB _id yet)
        if (serviceData && !serviceData._id) {
            // Check if someone else already favorited and cached this exact location
            let existingService = await Service.findOne({ 
                name: serviceData.name, 
                address: serviceData.address 
            });

            // If not, save it to MongoDB silently!
            if (!existingService) {
                existingService = await Service.create({
                    name: serviceData.name,
                    category: serviceData.category || "Service",
                    address: serviceData.address || "Mapped Location",
                    location: serviceData.location || { type: "Point", coordinates: [0, 0] },
                    phone: serviceData.phone || "",
                    website: serviceData.website || "",
                    description: "Live OpenStreetMap Data"
                });
            }
            // Use our newly created MongoDB _id for the user's favorites
            dbServiceId = existingService._id;
        }

        // Standard toggle logic
        const isFavorited = user.favorites.includes(dbServiceId);

        if (isFavorited) {
            user.favorites.pull(dbServiceId);
        } else {
            user.favorites.push(dbServiceId);
        }

        await user.save();

        res.status(200).json({ 
            message: isFavorited ? 'Removed from favorites' : 'Added to favorites',
            isFavorited: !isFavorited 
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const getMyFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('favorites');
        res.status(200).json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = { toggleFavorite, getMyFavorites };