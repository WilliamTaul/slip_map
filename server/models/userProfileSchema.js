const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userId: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('UserProfile', userProfileSchema);