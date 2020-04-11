const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');
const User = require('../models/user');

const signup = async (req, res, next) => {
  //look at req and check if any validation errors were detected
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, email, password } = req.body;

  //if email exist in db already throw error
  let existingUser;
  try{
    existingUser = await User.findOne({ email: email});
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  //if email exist in db already throw error
  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }
  
  // Create a hashed password using bcrypt library
  let hashedPassword;
  try{
    hashedPassword = await bcrypt.hash(password, 12);
  } catch(err) {
    const error = newHttpError(
      'Could not create User, please try again.',
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    cart: []
  });

  // Store created user in DB
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  res.status(201).json({ userId: createdUser.id, email: createdUser.email});

};

const login = async (req, res, next) => {
  console.log("In users login controller");
}

exports.signup = signup;
exports.login = login;
