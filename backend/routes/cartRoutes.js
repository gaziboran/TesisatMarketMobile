const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');

// ... existing routes ...

router.patch('/:id', auth, cartController.updateCartItem);

module.exports = router; 