const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
    role: 0,
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

  //generate token
  let token;
  try{
    //sign returns a string. First argument is the payload (data to encode)
    //Second argument is the private key
    token = jwt.sign(
      {userId: createdUser.id, email: createdUser.email, userRole: createdUser.role}, 
      process.env.JWT_KEY,     //key here must be the same as in login
      {expiresIn: '1h'}
    );
  } catch (err){
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  // send back userId, email, and token
  res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token, userRole: createdUser.role});

};

const login = async (req, res, next) => {
  const { email, password} = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({email: email});
  } catch (err) {
    const error = new HttpError(
      'Loggin in failed, please try again later.',
      500
    );
    return next(error);
  }

  if(!existingUser){
    const error = new HttpError(
      'No user found, signup instead',
      401
    );
    return next(error);
  }

  let isValidPassword = false;
  try{
    // Compare the incoming password from the req to the hashed password in the DB with the use of bcrypt
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
    return next(error);
  }

  if(!isValidPassword) {
    const error = new HttpError(
      'Wrong password, could not log you in.',
      401
    );
    return next(error);
  }

  // Generate token
  let token;
  try{
    //sign returns a string. First argument is the payload (data to encode)
    //Second argument is the private key
    token = jwt.sign(
      {userId: existingUser.id, email: existingUser.email, userRole: existingUser.role}, 
      process.env.JWT_KEY,     //key here must be the same as in signup
      {expiresIn: '1h'}
    );
  } catch (err){
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  //send back id, email
  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
    userRole: existingUser.role
  });
}

exports.signup = signup;
exports.login = login;
