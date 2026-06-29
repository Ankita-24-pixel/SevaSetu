const Service = require("../models/Service");

const createService = async (req, res)=>{
    try{
        const{
            name,
            description,
            serviceType,
            category,
            address,
            city,
            state,
            phone,
            website,
            location
        } = req.body;

        const service = await Service.create({
            name,
            description,
            serviceType,
            category,
            address,
            city,
            state,
            phone,
            website,
            location
        });

        res.status(201).json({
            message: "Service created successfully",
            service
        });
    }catch(error){
        res.status(500).json({
            message: error.message
        });
    }
}
const getAllServices = async(req, res) =>{
    try{
        const services = await Service.find();
        res.status(200).json(services);
    }catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};
const getServiceById = async (req, res) => {
    try {

        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                message: "Service not found"
            });
        }

        res.status(200).json(service);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
const searchServices = async (req, res) => {
    try {

        const query = {};

        if (req.query.keyword) {
    query.$or = [
        {
            name: {
                $regex: req.query.keyword,
                $options: "i"
            }
        },
        {
            description: {
                $regex: req.query.keyword,
                $options: "i"
            }
        }
    ];
}


        if (req.query.category) {
            query.category = req.query.category;
        }

        if (req.query.city) {
            query.city = req.query.city;
        }

        if (req.query.serviceType) {
            query.serviceType = req.query.serviceType;
        }

        const services = await Service.find(query);

        res.status(200).json(services);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
const updateService = async (req, res) => {
    try {

        const service =
            await Service.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!service) {
            return res.status(404).json({
                message: "Service not found"
            });
        }

        res.status(200).json(service);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
const deleteService = async (req, res) => {
    try {

        const service =
            await Service.findByIdAndDelete(
                req.params.id
            );

        if (!service) {
            return res.status(404).json({
                message: "Service not found"
            });
        }

        res.status(200).json({
            message: "Service deleted"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const getNearbyServices = async (req, res) => {
  try {
    const { lat, lng, radius, category, type } = req.query;

    let searchQuery = {};

    if (category) {
      searchQuery.$or = [
        { name: { $regex: new RegExp(category, "i") } },
        { category: { $regex: new RegExp(category, "i") } }
      ];
    }

    if (!lat || !lng || lat === 'null' || lng === 'null' || lat === 'undefined') {
      return res.status(400).json({ message: "Missing or invalid location." });
    }

    // 2. The Magic Aggregation Pipeline
    const services = await Service.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          distanceField: "calculatedDistance", // MongoDB will inject the exact distance (in meters) here!
          maxDistance: parseFloat(radius)*1000,
          spherical: true,
          query: searchQuery
        }
      }
    ]);

    res.status(200).json(services);

  } catch (error) {
    console.error("Geospatial Search Error:", error);
    res.status(500).json({ 
      message: "An error occurred while searching for services.",
      error: error.message 
    });
  }
};

module.exports = { getNearbyServices };
module.exports = {createService, getAllServices, getServiceById, searchServices, getNearbyServices};