const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

//routing middlewares
//app.use('/api/items', itemsRoutes);
app.use('/api/users', usersRoutes);
//app.use ('/api/admin', adminRoutes);

//handle unwanted request
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

//error handling middleware
app.use((error, req, res, next) => {
  /*
  if(res.headerSent){
    return next(error);
  }
  */
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!'});
});

mongoose
  .connect(
    `mongodb+srv://jack123:jack123@cluster0-fqlfx.mongodb.net/shop?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(5000);
    console.log("listening on port 5000");
  })
  .catch(err => {
    console.log(err);
  });