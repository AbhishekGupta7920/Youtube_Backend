const channels = require("../models/subscribeModels")


async function addChannel(req, res) {
    if (req.method === 'GET') {
        return res.render('addChannel');
    } else if (req.method === 'POST') {
        try {
            const { channelName } = req.body;
            // console.log(req.body)
            await channels.create({
                channelName: channelName,
                subscribers: [],
                subscriptions: []
            });
            return res.redirect('/');
        } catch (error) {
            console.error('Error creating channel:', error);
            return res.render('addChannel', {
                error: 'Failed to create channel'
            });
        }
    }
}


async function getAllChannels(req, res) {
    const allChannels = await channels.find({});
    return res.render('home', {
        allChannels: allChannels
    })
}


// details of one channel 
async function channelDetails(req, res) {
    try {
        const channelId = req.params.channelId;
        const channelDetails = await channels.findById(channelId);
  
        const channelsToSubscribe = await channels.find({
            _id: { $ne: channelId }, 
            subscribers: { $not: { $elemMatch: { subscriber: channelId } } } 
        });

        return res.render('channel', {
            channelDetails: channelDetails,
            channelsToSubscribe: channelsToSubscribe
        });
    } catch (error) {
        console.error('Error fetching channel details:', error);
        return res.status(500).send('Internal Server Error');
    }
}


async function getResources(req, res){
    return res.render('resources');
}


module.exports = { addChannel, getAllChannels, channelDetails, getResources }