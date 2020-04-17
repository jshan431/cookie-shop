const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  title: { type: String, required: true},
  description: { type: String, required: true},
  image: { type: String, required: true},
  categoryId: { type: mongoose.Types.ObjectId, required: true, ref: 'Category'},
  price: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Item', itemSchema);