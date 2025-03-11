const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

// MongoDB connection
module.exports = {
    connectMongoDB: () => { //currently allowed IP addresses: 129.222.179.114
        const uri = process.env.NODE_ENV === 'production'
            ? process.env.MONGODB_URI_PROD // Use production MongoDB URI
            : process.env.MONGODB_URI_LOCAL; // Use local MongoDB URI

        mongoose.connect(uri)
        .then(() => {
            console.log(`Connected to MongoDB: ${process.env.NODE_ENV}`);
        }).catch(err => {
            console.error("MongoDB connection error:", err);
        });
    },

    // MongoDB Model
    Post: mongoose.model('Post', new mongoose.Schema({
        content: String,
        author: String,
        date: { type: Date, default: Date.now }
    }))
};
