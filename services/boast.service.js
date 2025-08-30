const Boast = require("../models/boast.model");
const BoastPlan = require("../models/boastPlan.model")
const { BoastPlanSettings } = require("../utils/enum");


// const createBoast = async (userId, boastData) => {
//   const { planType } = boastData;

//   const planConfig = BoastPlanSettings[planType];
//   if (!planConfig) {
//     throw new Error(`Invalid plan type: ${planType}`);
//   }

//   const startDate = new Date();
//   const endDate = new Date(startDate);
//   endDate.setDate(startDate.getDate() + planConfig.duration);

//   const boast = new Boast({
//     ...boastData,
//     userId,
//     startDate,
//     endDate,
//     duration: planConfig.duration,
//     maxViews: planConfig.maxViews,
//     amount: planConfig.amount,
//     viewedUsers: [],
//   });

//   return await boast.save();
// };

const createBoast = async (userId, boastData) => {
    const { planTypeId } = boastData;
  
    const planConfig = await BoastPlan.findById(planTypeId);
    if (!planConfig) {
      throw new Error(`Invalid planTypeId: ${planTypeId}`);
    }
    console.log(planTypeId)
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + planConfig.duration);
   console.log(planConfig)
    const boast = new Boast({
      ...boastData,
      userId,
      startDate,
      endDate,
      planType: planConfig.type,
      duration: planConfig.duration,
      duration: planConfig.duration,
      maxViews: planConfig.maxViews,
      amount: planConfig.amount,
      viewedUsers: [],
    });
  
    return await boast.save();
  };

const getAllAvailableBoasts = async (query) => {
  const {
        city,
        minPrice,
        maxPrice,
        propertyType,
        userLocation_longitude,
        userLocation_latitude,
        nearbyRange,
        saleType,
        search,
        locality
    } = query;

     const longitude = parseFloat(userLocation_longitude);
    const latitude = parseFloat(userLocation_latitude);

    const propertyMatch = { isDeleted: false };

    if (city) propertyMatch.city = city;
       if (locality) propertyMatch.locality = locality;
    if (saleType) propertyMatch.saleType = saleType;
    if (propertyType) propertyMatch.propertyType = propertyType;

    if (minPrice !== undefined || maxPrice !== undefined) {
        propertyMatch.propertyPrice = {};
        if (minPrice !== undefined) propertyMatch.propertyPrice.$gte = parseFloat(minPrice);
        if (maxPrice !== undefined) propertyMatch.propertyPrice.$lte = parseFloat(maxPrice);
    }

    if (search) {
        const searchRegex = new RegExp(search, "i");
        propertyMatch.$or = [
            { pincode: searchRegex },
            { landmark: searchRegex },
            { completeAddress: searchRegex },
            { bhkDetails: searchRegex },
            { propertyName: searchRegex },
            { propertySize: searchRegex },
            {locality:searchRegex }
        ];
    }

    if (longitude && latitude && nearbyRange) {
        propertyMatch.geoCoordinates = {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                },
                $maxDistance: parseFloat(nearbyRange) * 1000 // km to meters
            }
        };
    }

    const boasts = await Boast.find({
        endDate: { $gte: new Date() },
        $expr: { $lt: [{ $size: "$viewedUsers" }, "$maxViews"] }
    }).populate({
        path: "propertyId",
        match: propertyMatch
    });

    // Step 2: Filter out those where the property was not matched
    const filteredBoasts = boasts.filter(b => b.propertyId); // remove those with null propertyId after match

    // Step 3: Return just the property documents
    return filteredBoasts.map(b => b.propertyId);
};

const getMyBoostedProperties = async (userId) => {
    const boasts = await Boast.find({
        userId,
        endDate: { $gte: new Date() },
        $expr: { $lt: [{ $size: "$viewedUsers" }, "$maxViews"] },
    }).populate("propertyId");

    return boasts.map(b => b.propertyId);
};

const getMyALLBoastedProperties = async (userId) => {
    const now = new Date();
  
    const boasts = await Boast.find({ userId })
      .populate("propertyId")
      .populate("planTypeId"); // Optional: if you want full plan details
  
    const active = [];
    const expired = [];
  
    boasts.forEach(b => {
      const isExpiredByDate = b.endDate < now;
      const isExpiredByViews = b.viewedUsers.length >= b.maxViews;
  
      const boostDetails = {
        planType: b.planType,
        duration: b.duration,
        amount: b.amount,
        maxViews: b.maxViews,
        viewsUsed: b.viewedUsers.length,
        startDate: b.startDate,
        endDate: b.endDate,
      };
  
      const entry = {
        property: b.propertyId,
        boostDetails,
      };
  
      if (isExpiredByDate || isExpiredByViews) {
        expired.push(entry);
      } else {
        active.push(entry);
      }
    });
  
    return { active, expired };
  };

const getActiveBoast = async (propertyId) => {
    return await Boast.findOne({
        propertyId,
        endDate: { $gte: new Date() },
    });
};


const addView = async (userId,propertyId) => {
        const boast = await getActiveBoast(propertyId); 
        if (!boast) return { error: "Boost not found or expired" };

        if (boast.viewedUsers.includes(userId)) {
            return { message: "User already counted in views", views: boast.viewedUsers.length };
        }

        if (boast.viewedUsers.length >= boast.maxViews) {
            return { message: "Boost views limit reached" };
        }

        boast.viewedUsers.push(userId);
        await boast.save();

        return { message: "View added", views: boast.viewedUsers.length };
    }

    const getAllBoastPlans = async () => {
        return await BoastPlan.find({});
      };
      
    module.exports = {
        createBoast,
        getActiveBoast,
        addView,
        getAllAvailableBoasts,
        getAllBoastPlans,
        getMyBoostedProperties,
        getMyALLBoastedProperties
    };

