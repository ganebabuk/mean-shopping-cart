const mongoose = require('mongoose');

const checkoutSchema = mongoose.Schema({
  carts: [{
      skuid: { type: String, required: true },
      devicename: { type: String, required: true },
      deviceofferprice: { type: Number, required: true },
      deviceprice: { type: Number, required: true },
      totalamount: { type: Number, required: true },
      currency: { type: String, required: true },
      deviceimage: { type: String, required: true },
      qty: { type: Number, required: true }
  }],
  customer: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    currencyType: { type: String, required: true },
    dateCreated: { type: Date, required: true},
    shipmentStatus: { type: String, required: true }
  }
});

module.exports = mongoose.model('Checkout', checkoutSchema);
