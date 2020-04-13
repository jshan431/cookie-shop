const Category = require('../models/category');
const User = require('../models/user');
const HttpError = require('../models/http-error');

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

exports.getCategories = getCategories;