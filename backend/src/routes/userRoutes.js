const express = require('express');
const router = express.Router();
const { toggleFavorite, getMyFavorites } = require('../controllers/userController');
const  protect  = require('../middleware/authMiddleware'); // Your JWT checker

router.post("/favorites/toggle", protect, toggleFavorite);
router.get("/favorites", protect, getMyFavorites);

module.exports = router;