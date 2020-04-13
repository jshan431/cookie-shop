const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const adminController = require('../controllers/admin-controller');

router.post(
  '/category', 
  [
    check('categoryName')
      .not()
      .isEmpty()
  ],
  adminController.postCategory
);

router.post(
  '/item',
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  adminController.postItem
);

module.exports = router;