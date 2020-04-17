const express = require('express');
const itemsController = require('../controllers/items-controllers');
const checkAuth = require('../middleware/check-auth-logged-in');

const router = express.Router();

router.get('/categories', itemsController.getCategories);

router.get('/category/:cid', itemsController.getItemsByCategoryId);

router.get('/', itemsController.getAllItems);

router.get('/:iid', itemsController.getItemById);

router.use(checkAuth);

router.post('/cart/:uid', itemsController.addItemToCart);

router.get('/cart/:uid', itemsController.getCart);

module.exports = router;