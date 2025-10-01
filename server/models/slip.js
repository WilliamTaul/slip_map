const mongoose = require('mongoose');

const slipSchema = new mongoose.Schema({
    name: { type: String },
    x: { type: Number },
    y: { type: Number },
    season: { type: Number, enum: [1, 2, 3]}
});

module.exports = mongoose.model('Slip', slipSchema);