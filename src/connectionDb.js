
const mongoose = require('mongoose');
const channels = require('./models/subscribeModels.js');
const { channelsName } = require('./data/dummyData.js')


async function connectToDatabase(mongodb_url) {
    mongoose.connect(mongodb_url, {
        dbName: 'youtube_backend',
    })
        .then(async () => {
            console.log('Connected to MongoDB');
            const count = await channels.countDocuments();
            if (count === 0) {
                await channels.insertMany(channelsName);
                console.log('Database created successfully');
            } else {
                console.log('Database already contains data, skipping insertion');
            }
        })
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error);
        });
}

module.exports = { connectToDatabase };




