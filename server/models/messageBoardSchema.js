const mongoose = require('mongoose');

const messageBoardSchema = new mongoose.Schema({
    users: {type: [String]},
    title: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MessageBoard', messageBoardSchema);