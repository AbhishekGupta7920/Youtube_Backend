const channels = require('../models/subscribeModels.js')

async function addChannel(req, res) {
    try {
        const { channelName } = req.body;
        await channels.create({
            channelName: channelName,
            subscribers: [],
            subscriptions: []
        });
        const createdChannelDetails = await channels.find({ channelName: channelName })
        return res.status(200).json({
            message: "channel created succesfully",
            createdChannelDetails
        });
    } catch (error) {
        return res.status(500).json({
            message: "error creating channel",
            error: error
        })
    }

}


async function getAllChannels(req, res) {
    try {
        const allChannels = await channels.find({});
        return res.status(200).json({
            data: allChannels
        })
    } catch (error) {
        res.status(500).json({
            message: "Error while fetching",
            error: error
        })
    }
}


async function getAllNames(req, res) {
    try {
        const allChannels = await channels.find();
        const allNames = allChannels.map(channel => channel.channelName);
        res.status(200).json(allNames);
    } catch (error) {
        console.error('Error fetching channel names:', error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
}


async function subscribeChannel(req, res) {
    const { channelId } = req.params;
    const { targetChannelId } = req.body;

    try {
        const channel = await channels.findById(channelId);
        const targetChannel = await channels.findById(targetChannelId);

        if (!channel || !targetChannel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        // Subscribe the channel to the target channel with subscription date/time
        channel.subscriptions.push({
            channel: targetChannel._id,
            subscribedAt: new Date()
        });
        await channel.save();

        // Add the channel to the subscribers of the target channel with subscription date/time
        targetChannel.subscribers.push({
            subscriber: channel._id,
            subscribedAt: new Date()
        });
        await targetChannel.save();

        res.status(200).json({ message: 'Subscribed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


async function getAllSubscribers(req, res) {
    const { channelId } = req.params;
    try {
        const channel = await channels.findById(channelId).populate('subscribers.subscriber');
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" })
        }
        res.status(200).json(channel.subscribers)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


async function getAllSubscriptions(req, res) {
    const { channelId } = req.params;
    try {
        const channel = await channels.findById(channelId).populate('subscriptions.channel');
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }
        res.status(200).json(channel.subscriptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


async function deleteChannel(req, res) {
    try {
        const channelId = req.params.channelId;
        const deletedChannel = await channels.findByIdAndDelete(channelId);
        if (!deletedChannel) {
            return res.status(404).json({
                error: 'Channel not found'
            });
        }
        res.status(200).json({
            message: 'Channel deleted successfully',
            deletedChannel
        });
    } catch (error) {
        console.error('Error deleting channel:', error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
}



async function updateChannelName(req, res) {
    try {
        const channelId = req.params.channelId;
        const newName = req.body.channelName;
        const channel = await channels.findById(channelId);
        if (!channel) {
            return res.status(404).json({
                message: 'Channel not found'
            });
        }
        channel.channelName = newName;
        const updatedChannel = await channel.save();
        res.status(200).json(updatedChannel);
    } catch (error) {
        console.error('Error updating channel name:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {
    addChannel,
    getAllChannels,
    getAllNames,
    subscribeChannel,
    getAllSubscribers,
    getAllSubscriptions,
    deleteChannel,
    updateChannelName
}