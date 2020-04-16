const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Category = require('../models/category');
const Item = require('../models/item');
const HttpError = require('../models/http-error');
const fs = require('fs');

const postCategory = async (req, res, next) => {
  //look at req and check if any validation errors were detected
  const errors = validationResult(req);
  if(!errors.isEmpty()){

    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { categoryName } = req.body;

  //if email exist in db already throw error
  let existingCategory;
  try{
    existingCategory = await Category.findOne({ categoryName: categoryName});
  } catch (err) {
    const error = new HttpError(
      'Creating new category failed, please try again later.',
      500
    );
    return next(error);
  }

  //if email exist in db already throw error
  if (existingCategory) {
    const error = new HttpError(
      'Category exists already',
      422
    );
    return next(error);
  }

  const createdCategory = new Category({
    categoryName,
    categoryImageUrl : req.file.path,
  });

  // Store created category in DB
  try {
    await createdCategory.save();
  } catch (err) {
    const error = new HttpError(
      'Creating category failed, please try again later.',
      500
    );
    return next(error);
  }

  res.status(201).json({ categoryName: createdCategory.categoryName, categoryImageUrl: createdCategory.categoryImageUrl});
  
}

const updateCategory = async (req, res, next) => {
  //look at req and check if any validation errors were detected
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data inputs.', 422)
    );
  }

  const { categoryName, categoryImageUrl } = req.body;
  const categoryId = req.params.cid;

  let category;
  try {
    category = await Category.findById(categoryId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update category',
      500
    );
    return next(error);
  }
  console.log(category);
  // Check if admin is trying to update category

  // make changes for the found category in the DB
  category.categoryName = categoryName;
  category.categoryImageUrl = categoryImageUrl;

  console.log("after changes");
  console.log(category);

  // store updated category
  try {
    await category.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update category. Try later',
      500
    );
    return next(error);
  }
  //turn our given mongoose object back to a JS object.
  res.status(200).json({ category: category.toObject({ getters: true }) });
};

const postItem = async (req, res, next) => {
  //look at req and check if any validation errors were detected
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description, categoryId } = req.body;

  const createdItem = new Item({
    title,
    description,
    image : req.file.path,
    categoryId
  });

  let categoryCheck;
  try {
    categoryCheck = await Category.findById({_id: categoryId});
  } catch (err) {
    const error = new HttpError(
      'Creating item failed, please try again later.',
      500
    );
    return next(error);
  }

  if(!categoryCheck){
    const error = new HttpError('Could not find category for provided id', 404);
    return next(error);
  }

  console.log(categoryCheck);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdItem.save({session: sess});
    categoryCheck.items.push(createdItem);
    await categoryCheck.save({session: sess});
    await sess. commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating place item failed, please try again later.',
      500
    );
    return next(error);
  }

  res.status(201).json({item: createdItem});
}

const updateItem = async (req, res, next) => {
  //look at req and check if any validation errors were detected
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description, image } = req.body;
  const itemId = req.params.iid;

  let item;
  try{
    item = await Item.findById(itemId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update item.',
      500
    );
    return next(error);
  }

  // Check the role of the user. If not admin, throw error



  // make changes for the found item in the DB
  item.title = title;
  item.description = description;
  item.image = image;

  // try to store update item
  try {
    await item.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update item.',
      500
    );
    return next(error);
  }
  re
};

const deleteItem = async (req, res, next) => {
  const itemId = req.params.iid;
  console.log(itemId);
  let item;
  try{
    item = await Item.findById(itemId).populate('categoryId');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete item.',
      500
    );
    return next(error);
  }

  if(!item){
    const error = new HttpError('Could not find item for this id.', 401);
    return next(error);
  }

  const imagePath = item.image;

  try{
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await item.remove({session: sess});
    item.categoryId.items.pull(item);
    await item.categoryId.save({session: sess});
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete item. Try again later',
      500
    );
    return next(error);
  }

  // remove the item's image stored in uploads / images
  fs.unlink(imagePath, err => {
    console.log(err);
  });

  res.status(200).json({ message: 'Deleted item.'});
};

exports.postItem = postItem;
exports.postCategory = postCategory;
exports.updateCategory = updateCategory;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;