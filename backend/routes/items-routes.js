const express = require('express');
const itemsController = require('../controllers/items-controllers');

const router = express.Router();

router.get('/categories', itemsController.getCategories);

router.get('/category/:cid', itemsController.getItemsByCategoryId);

router.get('/', itemsController.getAllItems);

router.get('/:iid', itemsController.getItemById);

module.exports = router;