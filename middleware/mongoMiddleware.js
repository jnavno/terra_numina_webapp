const mongoose = require('mongoose');

// MongoDB connection
module.exports = {
    connectMongoDB: () => { //currently allowed IP addresses: 129.222.179.114
        const uri = 'mongodb+srv://subsjnn:MWfnDObuKfdPvaA6@dev-cluster.fj1uv.mongodb.net/?retryWrites=true&w=majority&appName=dev-cluster';
        // For local MongoDB, use the following URI instead
        // const uri = 'mongodb://localhost:27017/knowledge-platform';

        mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log("Connected to MongoDB!");
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
