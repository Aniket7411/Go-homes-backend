const mongoose = require('mongoose');
const { PROPERTY_TYPE, FURNITURE_TYPE, SALE_TYPE, AUCTION_TYPE, ROLE } = require('../utils/enum');

const PropertySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    video: { type: String },
    images: [{ type: String }],
    backgroundMusic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Music',
    },
    propertyType: {
        type: String,
        enum: PROPERTY_TYPE,
        required: true
    },
    furnitureType: {
        type: String,
        enum: FURNITURE_TYPE,
        
    },
construction_status: {
  type: String,
  enum: [
    'IN_PROGRESS',
    'COMPLETED',
  ]
},

    rent_per_person:{type:String},
    bhkDetails: { type: String },
    propertyPrice: { type: Number },
    propertyName: { type: String },
    propertySize: { type: String },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: { type: String },
    locality:{type:String},
    completeAddress: { type: String, required: true },
    geoCoordinates: {
        type: { type: String, enum: ['Point'], required: true, default: 'Point' },
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    },
    includedDetails: {
        bedrooms: { type: Number, default: 0 },
        bathrooms: { type: Number, default: 0 },
        kitchen: { type: Number, default: 0 },
        balcony: { type: Number, default: 0 },
        parking: { type: Number, default: 0 }
    },

    ownerDetails: {
        name: { type: String },
        email: { type: String },
        aadhar: { type: String },
        reraNumber: { type: String }
    },

    saleType: {
        type: String,
        enum: SALE_TYPE,
        required: true
    },
    PGorProperty:{
        type:String
    },
    role: { type: String, enum: ROLE },
    auctionDetails: {
        auctionStartDateTime: {
            type: Date,
        },
        auctionEndDateTime: {
            type: Date,
        },
        auctionType: {
            type: String,
            enum: AUCTION_TYPE,
        },
        minIncrementValue: {
            type: Number,
        },
        startingBidAmount: {
            type: Number,
        },
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    propertyCode: {
        type: String,
        unique: true,
    },
    isSold: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      },      

    createdAt: { type: Date, default: Date.now }
});

PropertySchema.pre('save', async function (next) {
    if (!this.propertyCode) {
        try {
            const lastProperty = await mongoose.model('Property')
                .findOne({ propertyCode: { $exists: true } })
                .sort({ createdAt: -1 });

            let lastNumber = 0;
            if (lastProperty && lastProperty.propertyCode) {
                const match = lastProperty.propertyCode.match(/PRO-(\d+)/);
                if (match) {
                    lastNumber = parseInt(match[1]);
                }
            }

            this.propertyCode = `PRO-${lastNumber + 1}`;
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});


// **Custom Pre-save Middleware for Validation**
PropertySchema.pre('validate', function (next) {
    if (this.saleType === 'Auction') {
        if (!this.auctionDetails || Object.keys(this.auctionDetails).length === 0) {
            return next(new Error('auctionDetails is required when saleType is Auction'));
        }
    } else {
        this.auctionDetails = undefined; // Remove auctionDetails if saleType is not 'Auction'
    }
    next();
});


PropertySchema.index({ geoCoordinates: "2dsphere" });

const Property = mongoose.model('Property', PropertySchema);
module.exports = Property;
