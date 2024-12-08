const express = require('express');
const { getAllChannels, channelDetails, addChannel, getResources } = require('../controllers/viewControllers');

const router = express.Router();


router.get('', getAllChannels)
router.get('/resources', getResources)
router.get('/addChannel', addChannel)
router.post('/addChannel', addChannel)
router.get('/channel/:channelId', channelDetails)

module.exports = router;