const express = require('express')
const router = express.Router()

const links = require('../controllers/link');
const messages = require('../controllers/messages');

router.post('/create', links.generateLink, messages.addLinkToUser)
router.get('/view/:messageHash', messages.checkFirstViewed, messages.incrementViewCount, messages.checkLinkValidity, messages.getMessage)//, 

module.exports = router;