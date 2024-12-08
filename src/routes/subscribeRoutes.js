const express = require('express');

const {
    subscribeChannel,
    addChannel,
    getAllChannels,
    getAllNames,
    getAllSubscribers, 
    getAllSubscriptions,
    deleteChannel,
    updateChannelName
} = require('../controllers/subscribeControllers.js')

const router = express.Router();

router.post('/addChannel', addChannel);
router.get('/all', getAllChannels);
router.get('/names', getAllNames);
router.post('/:channelId/subscribe', subscribeChannel);
router.get('/:channelId/subscribers', getAllSubscribers);
router.get('/:channelId/subscriptions', getAllSubscriptions);
router.delete('/:channelId/delete', deleteChannel);
router.put('/:channelId/update', updateChannelName);


module.exports = router;