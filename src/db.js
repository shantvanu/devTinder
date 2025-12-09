const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = process.env.MONGO_URI ||
        'mongodb+srv://shantvanumutha123:shantvanumutha123@rideapp-cluster.vnpmuza.mongodb.net/learning?retryWrites=true&w=majority';
    try {
        await mongoose.connect(uri);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error', err);
        throw err;
    }
};

module.exports = connectDB;