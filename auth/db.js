import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.AUTH_DB_NAME}`);
        console.log('User DB Connected!');
    } catch (err) {
        console.error('User DB connection failed: ', err);
        process.exit(1);
    }
};

export default connectDB;