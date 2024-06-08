const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Photo Upload', 'New Comment', 'User Register', 'User Login', 'User Logout'], required: true },
  date: { type: Date, default: Date.now },
  additionalInfo: { type: mongoose.Schema.Types.Mixed }
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
