const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const adminController = require('../controllers/admin-controller');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

// middleware that checks for valid token. Subsequent routes cannot be reached without valid token
router.use(checkAuth);

router.post(
  '/category',
  fileUpload.single('categoryImageUrl'),
  [
    check('categoryName')
      .not()
      .isEmpty()
  ],
  adminController.postCategory
);

router.post(
  '/item',
  fileUpload.single('image'),
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  adminController.postItem
);

router.patch(
  '/category/:cid',
  [
    check('categoryName')
      .not()
      .isEmpty()
  ],
  adminController.updateCategory
);

router.patch(
  '/item/:iid',
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  adminController.updateItem
);

router.delete('/:iid', adminController.deleteItem);

module.exports = router;