const express = require('express');
const router = express.Router();
const { getTeamMembers } = require('../controllers/teamController');

router.get('/', getTeamMembers);

module.exports = router;
