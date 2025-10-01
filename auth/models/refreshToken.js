import mongoose from 'mongoose';

const refreshSchema = new mongoose.Schema({
    token: {type: String, required: true, unique: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    createdAt: { type: Date, default: Date.now, expires: '7d'}
})

const RefreshToken = mongoose.model('RefreshToken', refreshSchema);

export default RefreshToken;