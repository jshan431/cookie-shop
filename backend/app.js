const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const usersRoutes = require('./routes/users-routes');
const itemsRoutes = require('./routes/items-routes');
const adminRoutes = require('./routes/admin-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

//req that have localhost:5000/uploads/images
//static is a middleware that returns the requested file specifically from the joins paths of uploads images folder
//all files are locked down except files that go through this middleware
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

// Prevent CORS errors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

//routing middlewares
app.use('/api/items', itemsRoutes);
app.use('/api/users', usersRoutes);
app.use ('/api/admin', adminRoutes);

//handle unwanted request
app.use((req, res, next) => {
  const error = new HttpError('Could not find this specific route.', 404);
  throw error;
});

//error handling middleware
app.use((error, req, res, next) => {
  //if we get an error in the signup process remove the image that was saved
  if(req.file){
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  if(res.headerSent){
    return next(error);
  }
  
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!'});
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-fqlfx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT || 5000);
    console.log('Listening on PORT 5000');
  })
  .catch(err => {
    console.log(err);
  });

  //`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-fqlfx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`