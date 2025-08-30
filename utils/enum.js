// enum.js
const PropertyEnums = {
    PROPERTY_TYPE: ['Bungalow','House','Villa','Flat'],
    // PROPERTY_TYPE: ['Flat', 'Independent House', 'Villa', 'Apartment', 'Studio', 'Penthouse'],
    FURNITURE_TYPE: ['Fully Furnished', 'Semi-Furnished', 'Unfurnished'],
    SALE_TYPE: ['Sell', 'Rent/PG', 'Auction'],
    AUCTION_TYPE:['Open Bidding', 'Sealed Bidding'],
    ROLE :   ["BROKER", "SELLER", "BUYER"],
    PLAN_TYPE : {
        ONE_PROPERTY: "1 PROPERTY",
        THREE_PROPERTY: "3 PROPERTY",
        UNLIMITED: "UNLIMITED PROPERTY",
      },
    BOAST_TYPE: {
      BASIC: "BASIC",
      STANDARD: "STANDARD",
      PREMIUM: "PREMIUM",
    },
};

const BoastPlanSettings = {
  [PropertyEnums.BOAST_TYPE.BASIC]: {
    duration: 3,
    maxViews: 500,
    amount: 200,
  },
  [PropertyEnums.BOAST_TYPE.STANDARD]: {
    duration: 7,
    maxViews: 1500,
    amount: 400,
  },
  [PropertyEnums.BOAST_TYPE.PREMIUM]: {
    duration: 14,
    maxViews: 5000,
    amount: 800,
  },
};

module.exports = {
  PropertyEnums,
  BoastPlanSettings,
};
