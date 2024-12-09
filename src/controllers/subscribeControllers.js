const channels = require('../models/subscribeModels.js');

// Controller function to add a new channel
async function addChannel(req, res) {
    try {
        const { channelName } = req.body;
        // Create a new channel with an empty subscribers and subscriptions list
        await channels.create({
            channelName: channelName,
            subscribers: [],
            subscriptions: []
        });
        // Fetch and return the details of the created channel
        const createdChannelDetails = await channels.find({ channelName: channelName });
        return res.status(200).json({
            message: "Channel created successfully",
            createdChannelDetails
        });
    } catch (error) {
        // Handle any errors during channel creation
        return res.status(500).json({
            message: "Error creating channel",
            error: error
        });
    }
}

// Controller function to retrieve all channels
async function getAllChannels(req, res) {
    try {
        const allChannels = await channels.find({});
        // Respond with all channel data
        return res.status(200).json({
            data: allChannels
        });
    } catch (error) {
        // Handle errors during channel fetching
        res.status(500).json({
            message: "Error while fetching",
            error: error
        });
    }
}

// Controller function to get the names of all channels
async function getAllNames(req, res) {
    try {
        const allChannels = await channels.find();
        // Map and return only the channel names
        const allNames = allChannels.map(channel => channel.channelName);
        res.status(200).json(allNames);
    } catch (error) {
        // Handle errors during fetching channel names
        console.error('Error fetching channel names:', error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
}

// Controller function to subscribe a channel to another channel
async function subscribeChannel(req, res) {
    const { channelId } = req.params;
    const { targetChannelId } = req.body;

    try {
        // Fetch the source and target channels by their IDs
        const channel = await channels.findById(channelId);
        const targetChannel = await channels.findById(targetChannelId);

        if (!channel || !targetChannel) {
            // If either channel is not found, return an error
            return res.status(404).json({ message: 'Channel not found' });
        }

        // Add subscription details to the source channel
        channel.subscriptions.push({
            channel: targetChannel._id,
            subscribedAt: new Date()
        });
        await channel.save();

        // Add subscriber details to the target channel
        targetChannel.subscribers.push({
            subscriber: channel._id,
            subscribedAt: new Date()
        });
        await targetChannel.save();

        // Respond with a success message
        res.status(200).json({ message: 'Subscribed successfully' });
    } catch (error) {
        // Handle errors during subscription
        res.status(500).json({ message: error.message });
    }
}

// Controller function to get all subscribers of a channel
async function getAllSubscribers(req, res) {
    const { channelId } = req.params;
    try {
        // Fetch the channel and populate its subscribers
        const channel = await channels.findById(channelId).populate('subscribers.subscriber');
        if (!channel) {
            // If the channel is not found, return an error
            return res.status(404).json({ message: "Channel not found" });
        }
        // Respond with the list of subscribers
        res.status(200).json(channel.subscribers);
    } catch (error) {
        // Handle errors during fetching subscribers
        res.status(500).json({
            message: error.message
        });
    }
}

// Controller function to get all subscriptions of a channel
async function getAllSubscriptions(req, res) {
    const { channelId } = req.params;
    try {
        // Fetch the channel and populate its subscriptions
        const channel = await channels.findById(channelId).populate('subscriptions.channel');
        if (!channel) {
            // If the channel is not found, return an error
            return res.status(404).json({ message: 'Channel not found' });
        }
        // Respond with the list of subscriptions
        res.status(200).json(channel.subscriptions);
    } catch (error) {
        // Handle errors during fetching subscriptions
        res.status(500).json({ message: error.message });
    }
}

// Controller function to delete a channel
async function deleteChannel(req, res) {
    try {
        const channelId = req.params.channelId;
        // Find and delete the channel by ID
        const deletedChannel = await channels.findByIdAndDelete(channelId);
        if (!deletedChannel) {
            // If the channel is not found, return an error
            return res.status(404).json({
                error: 'Channel not found'
            });
        }
        // Respond with a success message and details of the deleted channel
        res.status(200).json({
            message: 'Channel deleted successfully',
            deletedChannel
        });
    } catch (error) {
        // Handle errors during channel deletion
        console.error('Error deleting channel:', error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
}

// Controller function to update a channel's name
async function updateChannelName(req, res) {
    try {
        const channelId = req.params.channelId;
        const newName = req.body.channelName;
        // Find the channel by ID
        const channel = await channels.findById(channelId);
        if (!channel) {
            // If the channel is not found, return an error
            return res.status(404).json({
                message: 'Channel not found'
            });
        }
        // Update the channel name and save it
        channel.channelName = newName;
        const updatedChannel = await channel.save();
        // Respond with the updated channel details
        res.status(200).json(updatedChannel);
    } catch (error) {
        // Handle errors during channel update
        console.error('Error updating channel name:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Export all controller functions
module.exports = {
    addChannel,
    getAllChannels,
    getAllNames,
    subscribeChannel,
    getAllSubscribers,
    getAllSubscriptions,
    deleteChannel,
    updateChannelName
};
