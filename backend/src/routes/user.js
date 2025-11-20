const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { profileUpdateValidation, validate } = require('../utils/validation');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, profileUpdateValidation, validate, updateProfile);

module.exports = router;