const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Category = require('../models/category');
const Item = require('../models/item');
const HttpError = require('../models/http-error');

const postCategory = async (req, res, next) => {
  //look at req and check if any validation errors were detected
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { categoryName, categoryImageUrl } = req.body;

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
    categoryImageUrl
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

const postItem = async (req, res, next) => {
  //look at req and check if any validation errors were detected
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description, image, categoryId } = req.body;

  const createdItem = new Item({
    title,
    description,
    image,
    categoryId
  });

  let categoryCheck;
  try {
    categoryCheck = await Category.findById({_id: categoryId});
  } catch (err) {
    console.log("inside the catch");
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

exports.postItem = postItem;
exports.postCategory = postCategory;

