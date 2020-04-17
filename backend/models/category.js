const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  categoryName: { type: String, required: true },
  categoryImageUrl: { type: String, required: true },           // might be the issue with updating categories
  items: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Item'}]
});

// ensure unique email 
categorySchema.plugin(uniqueValidator);

module.exports = mongoose.model('Category', categorySchema);