const User = require("../models/User");
const Property = require("../models/property.model");
const Boast = require("../models/boast.model");
const Loan = require("../models/loan.model");
const Payment = require("../models/payment.model");
const { PropertyEnums } = require("../utils/enum");
const Subscription = require("../models/subscription.model");

exports.fetchAllUsers = async () => {
  try {
    const users = await User.find().select("-__v");

    const result = await Promise.all(
      users.map(async (user) => {
        // Count properties by saleType
        const properties = await Property.aggregate([
          { $match: { userId: user._id, isDeleted: false } },
          {
            $group: {
              _id: "$saleType",
              count: { $sum: 1 }
            }
          }
        ]);

        // Map saleType counts
        const posted = {
          sell: 0,
          rent: 0,
          auction: 0,
        };

        properties.forEach((p) => {
          const type = p._id.toLowerCase(); // ensure lower case mapping
          if (posted[type] !== undefined) {
            posted[type] = p.count;
          }
        });

        // Count boasts
        const boosted = await Boast.countDocuments({ userId: user._id });

        return {
          _id: user._id,
          fullName: user.fullName || "",
          phoneNumber: user.phoneNumber,
          email: user.email || "",
          profilePicture: user.profilePicture,
          aadharNumber: user.aadharNumber || "",
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          posted,
          boosted,
        };
      })
    );

    return result;
  } catch (error) {
    console.error("Error in fetchAllUsers:", error);
    throw new Error("Could not fetch users");
  }
};

exports.getAllLoansWithUsers = async () => {
  return await Loan.find({})
    .populate("user", "fullName email phoneNumber profilePicture")
    .select("-__v");
};


exports.getAllProperties = async () => {
    return await Property.find({ isDeleted: false }).populate('userId', 'fullName');
  };
  

  exports.updatePropertyStatus = async (propertyId, status) => {
    try {
      const updatedProperty = await Property.findByIdAndUpdate(
        propertyId,
        { status },
        { new: true }
      );
      return updatedProperty;
    } catch (error) {
      console.error("Error in updatePropertyStatus:", error);
      throw new Error("Could not update property status");
    }
  };

exports.fetchDashboardStats = async () => { 
  const totalProperties = await Property.countDocuments();
  const boostedProperties = await Property.countDocuments({ isBoosted: true });
  const totalUsers = await User.countDocuments();

  const payments = await Payment.find({ status: "success" });
  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  // --- Chart Data Logic (Boast + Subscriptions grouped by month) ---
  const orderedMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyRevenueMap = {};

  const initMonthEntry = (month) => {
    const entry = { name: month };
    Object.values(PropertyEnums.BOAST_TYPE).forEach(type => entry[type] = 0);
    Object.values(PropertyEnums.PLAN_TYPE).forEach(type => entry[type] = 0);
    return entry;
  };

  const boasts = await Boast.find({});
  boasts.forEach(b => {
    const month = new Date(b.startDate).toLocaleString("default", { month: "short" });
    if (!monthlyRevenueMap[month]) {
      monthlyRevenueMap[month] = initMonthEntry(month);
    }
    monthlyRevenueMap[month][b.planType] += b.amount;
  });

  const subscriptions = await Subscription.find({}).populate("paymentId");
  subscriptions.forEach(s => {
    if (s.paymentId?.status === "success") {
      const month = new Date(s.paymentId.createdAt).toLocaleString("default", { month: "short" });
      if (!monthlyRevenueMap[month]) {
        monthlyRevenueMap[month] = initMonthEntry(month);
      }
      monthlyRevenueMap[month][s.planType] += s.paymentId.amount;
    }
  });

  const chartData = orderedMonths
    .map(m => monthlyRevenueMap[m])
    .filter(Boolean);

  // --- Recent Properties ---
  const properties = await Property.find({})
    .limit(5)
    .select("propertyName status propertyPrice video saleType")
    .lean();

  const formattedProperties = properties.map(p => ({
    id: p._id,
    propertyName: p.propertyName,
    status: p.status,
    propertyPrice: p.propertyPrice,
    video: p.video,
    saleType: p.saleType
  }));

  // --- Last 5 Transactions ---
// --- Last 5 Transactions ---
const lastTransactions = await Payment.find({ status: "success" })
  .sort({ _id: -1 })
  .limit(5)
  .populate("userId", "fullName email")
  .lean();

// Check for planType and planCategory
const formattedTransactions = await Promise.all(
  lastTransactions.map(async (tx) => {
    let planType = null;
    let planCategory = null;

    // Check in Boast
    const boast = await Boast.findOne({ paymentId: tx.razorpayPaymentId });
    if (boast) {
      planType = boast.planType;
      planCategory = "BOAST";
    } else {
      // Check in Subscription
      const subscription = await Subscription.findOne({ paymentId: tx._id });
      if (subscription) {
        planType = subscription.planType;
        planCategory = "SUBSCRIPTION";
      }
    }

    return {
      id: tx._id,
      user: tx.userId ? {
        name: tx.userId.fullName || "N/A",
        email: tx.userId.email || "N/A"
      } : null,
      amount: tx.amount,
      razorpayPaymentId: tx.razorpayPaymentId,
      date: tx.createdAt?.toISOString(),
      planType,
      planCategory
    };
  })
);


  // --- Final Return ---
  return {
    totalProperties,
    boostedProperties,
    totalUsers,
    totalRevenue,
    properties: formattedProperties,
    chartData,
    lastTransactions: formattedTransactions
  };
};

exports.hardDeleteProperty = async (propertyId) => {
  try {
    const deleted = await Property.findByIdAndDelete(propertyId);
    return deleted;
  } catch (error) {
    console.error("Error in hardDeleteProperty:", error);
    throw new Error("Failed to delete property");
  }
};
