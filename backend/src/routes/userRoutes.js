const express = require('express');
const router = express.Router();
const { toggleFavorite, getMyFavorites , forgotPassword, resetPassword} = require('../controllers/userController');
const  protect  = require('../middleware/authMiddleware');

router.post("/favorites/toggle", protect, toggleFavorite);
router.get("/favorites", protect, getMyFavorites);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;