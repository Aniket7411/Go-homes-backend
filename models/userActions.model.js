const mongoose = require('mongoose');

const UserActionsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  savedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  likedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
});

const UserActions = mongoose.model('UserActions', UserActionsSchema);
module.exports = UserActions;


//isliked array of obj propertyID
//issaved array of obj
//showContactDetails array of obj in subscription tab 
//boosted subscription user [] 