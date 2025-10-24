import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, 
    password: { type: String, required: true },
    role: {type: String, enum: ['user', 'admin', 'onboarding'], default: 'onboarding'}, // defaults to onboarding to force updating profile in client
})

const User = mongoose.model('User', userSchema);

export default User;