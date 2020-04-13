const express = require('express');
const itemsController = require('../controllers/items-controllers');

const router = express.Router();

router.get('/categories', itemsController.getCategories);

module.exports = router;