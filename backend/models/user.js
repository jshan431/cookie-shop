const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: Number, required: true},
  cart: {
    items: [
      {
        itemId: {
          type: Schema.Types.ObjectId,
          ref: 'Item',
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  }
});

userSchema.methods.addToCart = function(item) {
  // Check if item in cart already exist
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.itemId.toString() === itemId._id.toString();
  });

  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  // Either add to the quantity of an existing item or push a new one to the cart
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      itemId: item._id,
      quantity: newQuantity
    });
  }

  // update the cart with the new item
  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  return this.save();
};

// ensure unique email 
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
