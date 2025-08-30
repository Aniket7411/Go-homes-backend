const Subscription = require("../models/subscription.Model");
const { PLAN_TYPE } = require("../utils/enum")

exports.createSubscription = async (userId, planType, amount, paymentId) => {
    let expiryTime = null; 

    if (planType === PLAN_TYPE.ONE_PROPERTY) {
        expiryTime = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); // 1 Day
        propertyContactAvailable = 1;
    } else if (planType === PLAN_TYPE.THREE_PROPERTY) {
        expiryTime = null; // Unlimited expiry
        propertyContactAvailable = 3;
    }
    else if (planType === PLAN_TYPE.UNLIMITED) {
        expiryTime = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
        propertyContactAvailable = null // 3 Days for unlimited
    }

    const subscription = new Subscription({
        userId,
        planType,
        amount,
        expiryTime,
        paymentId,
        status: "active",
    });

    await subscription.save();
    return subscription;
};