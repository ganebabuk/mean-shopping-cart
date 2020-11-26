const mongoose = require('mongoose');
mongoose.set('useFindAndModify', true);
const cartsSchema = mongoose.Schema({
  carts: [{
      skuid: { type: String, required: true },
      devicename: { type: String, required: true },
      deviceofferprice: { type: Number, required: true },
      deviceprice: { type: Number, required: true },
      currency: { type: String, required: true },
      deviceimage: { type: String, required: true },
      qty: { type: Number, required: true }
  }],
  cartId : { type: String, required: true },
  dateCreated: { type: Date, required: true}
});

module.exports = mongoose.model('carts', cartsSchema);
