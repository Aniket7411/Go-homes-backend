const mongoose = require('mongoose');
const Property = require('../models/property.model'); // update path as needed

async function assignMissingPropertyCodes() {
    try {
        await mongoose.connect('mongodb+srv://gohomes:GOHOMES@cluster0.mnavg.mongodb.net/gohomes?retryWrites=true&w=majority'); // change DB name

        // Get all properties with propertyCode already set
        const propertiesWithCode = await Property.find({ propertyCode: { $exists: true } });
        const usedCodes = new Set();

        // Collect all used numbers
        propertiesWithCode.forEach(prop => {
            const match = prop.propertyCode.match(/PRO-(\d+)/);
            if (match) usedCodes.add(Number(match[1]));
        });

        // Find properties missing a propertyCode
        const propertiesWithoutCode = await Property.find({ $or: [{ propertyCode: { $exists: false } }, { propertyCode: null }] });

        let nextNumber = 1;
        for (const property of propertiesWithoutCode) {
            // Find next available number
            while (usedCodes.has(nextNumber)) {
                nextNumber++;
            }

            property.propertyCode = `PRO-${nextNumber}`;
            usedCodes.add(nextNumber);
            nextNumber++;

            await property.save();
            console.log(`Updated property ${property._id} with code ${property.propertyCode}`);
        }

        console.log('All missing propertyCodes assigned!');
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error updating property codes:', err);
    }
}

assignMissingPropertyCodes();
