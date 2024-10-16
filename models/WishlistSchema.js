const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    description: 'User ID of the wishlist owner (reference to Users collection)'
  },
  items: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
    description: 'Array of product IDs added to the wishlist (reference to Products collection)'
  }]
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
