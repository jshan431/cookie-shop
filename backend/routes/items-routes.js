const express = require('express');
const itemsController = require('../controllers/items-controllers');
const checkAuth = require('../middleware/check-auth-logged-in');

const router = express.Router();

router.get('/categories', itemsController.getCategories);

router.get('/category/:cid', itemsController.getItemsByCategoryId);

router.get('/', itemsController.getAllItems);

router.get('/:iid', itemsController.getItemById);

router.use(checkAuth);

router.post('/cart/:uid', itemsController.addItemToCart);       //probably don't need /:uid

router.get('/cart/:uid', itemsController.getCart);              //probably don't need /:uid

router.delete('/cart/:uid', itemsController.clearItemFromCart); //probably don't need /:uid

module.exports = router;