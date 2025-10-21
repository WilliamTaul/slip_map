import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/taulkie_auth');
        console.log('User DB Connected!');
    } catch (err) {
        console.error('User DB connection failed: ', err);
        process.exit(1);
    }
};

export default connectDB;