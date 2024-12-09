
const mongoose = require('mongoose');

// creating schema for channel
const channelSchema = new mongoose.Schema({
    // channel name field
    channelName: {
        type: String,
        required: true
    },
    // subscribers name field
    subscribers: [
        {
            subscriber: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'channels'
            },
            subscribedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    // Subscripions field
    subscriptions: [
        {
            channel: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'channels'
            },
            subscribedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    // this add data and time to our collection when we create it 
    addedAt: {
        type: Date,
        default: Date.now
    }
});

const channels = mongoose.model('channels', channelSchema);

module.exports = channels;
