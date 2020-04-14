const Category = require('../models/category');
const HttpError = require('../models/http-error');
const Item = require('../models/item');

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

exports.getCategories = getCategories;
exports.getItemsByCategoryId = getItemsByCategoryId;
exports.getItemById = getItemById;
exports.getAllItems = getAllItems;