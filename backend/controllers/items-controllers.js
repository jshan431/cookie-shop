const Category = require('../models/category');
const HttpError = require('../models/http-error');
const Item = require('../models/item');
const User = require('../models/user');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const getCategories = async (req, res, next) => {
  
  let categories;
  try{
    categories = await Category.find();
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ categories: categories.map(Category => Category.toObject({getters: true}))});
}

const getItemById = async (req, res, next) => {
  const itemId = req.params.iid;

  // Search DB
  let item;
  try {
    //get back a mongoose object
    item = await Item.findById(itemId);
  } catch (err) {
    //error will be caught if get request has problem
    const error = new HttpError(
      'Something went wrong, could not find the item.',
      500
    );
    return next(error);
  }

  // if the provided itemId is not found in our db return error
  if (!item) {
    const error = new HttpError(
      'Could not find item for the provided id.',
      404
    );
    return next(error);
  }

  //turn our given mongoose object back to a JS object.
  res.json({ item: item.toObject({ getters: true }) });

}

const getItemsByCategoryId = async (req, res, next) => {
  const categoryId = req.params.cid;

  let items;
  try {
    items = await Item.find({ categoryId: categoryId});
  } catch (err) {
    const error = new HttpError(
      'Fetching items failed, please try again later.',
      500
    );
    return next(error);
  }

  if(!items || items.length === 0){
    const error = new HttpError(
      'Could not find items for the provided user id.',
      404
    );
    return next(error);
  }

  // since notes is a mongoose array we use map on each element and make it into an object
  res.json({items: items.map(item => item.toObject({ getters: true}))});
};

const getAllItems = async (req, res, next) => {
  let items;
  try {
    items = await Item.find();
  } catch (err) {
    const error = new HttpError(
      'Fetching all items failed, please try again later.',
      500
    );
    return next(error);
  }

  if(!items || items.length === 0){
    const error = new HttpError(
      'Could not find items',
      404
    );
    return next(error);
  }

  // since notes is a mongoose array we use map on each element and make it into an object
  res.json({items: items.map(item => item.toObject({ getters: true}))});
};

const addItemToCart = async (req, res, next) => {

  // Is this the best way or is there a more secure method by getting the user object thats logged in
  const userId = req.params.uid;

  /*
  // userId we got from the token via check-auth-logged-in
  const userId = req.userData.userId;
  */

  console.log(userId);

  let user;
  try{
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find user with this id.',
      500
    );
    return next(error);
  }
  /////////////////
  

  const { itemId } = req.body;
  
  console.log(itemId);

  let item;
  try{
    item = await Item.findById(itemId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find item.',
      500
    );
    return next(error);
  }

  try {
    await user.addToCart(item);
  } catch (err) {
    const error = new HttpError(
      'Adding item to cart failed, please try again later.',
      500
    );
    return next(error);
  }

  //turn our given mongoose object back to a JS object.
  res.json({ item: item.toObject({ getters: true }) });

}

const getCart = async (req, res, next) => {
  // userId we got from the token via check-auth-logged-in
  const userId = req.userData.userId;

  let cart;
  try{
    cart = await User.findById(userId).select('cart.items -_id').populate('cart.items.itemId');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find user with this id.',
      500
    );
    return next(error);
  }
  //turn our given mongoose object back to a JS object.
  res.json({ cart: cart.toObject({ getters: true }) });

}

exports.getCategories = getCategories;
exports.getItemsByCategoryId = getItemsByCategoryId;
exports.getItemById = getItemById;
exports.getAllItems = getAllItems;
exports.addItemToCart = addItemToCart;
exports.getCart = getCart;

//populate('categoryId')