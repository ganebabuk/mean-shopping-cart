const mongoose = require('mongoose');

const deviceSchema = mongoose.Schema({
  skuid: { type: String, required: true },
  devicename: { type: String, required: true },
  deviceofferprice: { type: Number, required: true },
  deviceprice: { type: Number, required: true },
  currency: { type: String, required: true },
  deviceimage: { type: String, required: true }
});

module.exports = mongoose.model('Device', deviceSchema);
