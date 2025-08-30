const BoastService = require("../services/boast.service");

const createBoast = async (req, res) => {
    try {
        const userId = req.user._id;
        const boast = await BoastService.createBoast(userId, req.body);
        res.status(201).json({ success: true, message: "Boast created successfully", boast });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllAvailableBoasts = async (req, res) => {
    try {
        const properties = await BoastService.getAllAvailableBoasts(req.query);
        res.json({ success: true, properties });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}; 

const getMyBoostedProperties = async (req, res) => {
    try {
        const userId = req.user._id;
        const properties = await BoastService.getMyBoostedProperties(userId);
        res.json({ success: true, properties });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};  

const getMyALLBoastedProperties = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const result = await BoastService.getMyALLBoastedProperties(userId);
      res.json({success: true,data:result});
    } catch (error) {
      console.error("Error in getMyBoastedProperties:", error);
      res.status(500).json({ success: false, message: error.message|| "Failed to fetch boasted properties" });
    }
  };




const addView = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const userId= req.user._id;

        const response = await BoastService.addView(userId,propertyId);
        if (response.error) {
            return res.status(400).json({ success: false, message: response.error });
        }

        res.json({ success: true, ...response });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllPlans = async (req, res) => {
    try {
      const Allplans = await BoastService.getAllBoastPlans();
      res.status(200).json({ success: true, data:Allplans });
    } catch (error) {
      console.error("Error fetching boast plans:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

module.exports = {
    createBoast,
    addView,
    getAllAvailableBoasts,
    getAllPlans,
    getMyBoostedProperties,
    getMyALLBoastedProperties
};
