const express = require("express");
const bodyParser = require("body-parser");
const randomstring = require("randomstring");
const jwt = require('jsonwebtoken');
const Device = require("./models/device");
const Checkout = require("./models/checkout");
const Carts = require("./models/carts");
const dbConfig = require("./config/dbconfig");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const allowedOrigins = ["http://127.0.0.1:4200", "http://localhost:4200"];
  // const allowedOrigins = ["http://ganesh-mean-shopping.s3-website.ap-south-1.amazonaws.com"];
  if(allowedOrigins.indexOf(req.headers.origin) > -1){
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  }
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, cartId"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

validateToken =  (token) => {
  try {
    jwt.verify(token, 'JiRJmdsWmA');
    return true;
  }
  catch(e) {
    console.log('token status:', e.message);
  }
};

app.get("/api/session", (req,res, next) => {
  if (req.headers && req.headers.cartid) {
    if(validateToken(req.headers.cartid)) {
      res.status(200).json({'cartId': req.headers.cartid, 'token': 'existing token'});
    } else {
      const token = jwt.sign({ 'user': 'anonymous' }, 'JiRJmdsWmA', { expiresIn: '1 days'});
      res.status(200).json({'cartId': token, 'token': 'new token'});
    }
  } else {
    const token = jwt.sign({ 'user': 'anonymous' }, 'JiRJmdsWmA', { expiresIn: '1 days'});
    res.status(200).json({'cartId': token, 'token': 'new token'});
  }
});

app.get("/api/devices", (req, res, next) => {
  if(validateToken(req.headers.cartid)) {
    Device.find().then(devices => {
      res.status(200).json(devices);
    });
  } else {
    res.status(404).json({'Error:': 'invalid token or token not found in your request.'});
  }
});

app.get("/api/device-details/:skuid", (req, res, next) => {
  if(validateToken(req.headers.cartid)) {
    Device.findOne({"skuid": req.params.skuid}).then(documents => {
      if (documents) {
        res.status(200).json(documents);
      } else {
        res.status(404).json({'error': 'Requested device not found.'});
      }
    });
  } else {
    res.status(404).json({'Error:': 'invalid token or token not found in your request.'});
  }
});

app.post("/api/device-details", (req, res, next) => {
  if(validateToken(req.headers.cartid)) {
    let findQuery = {'cartId': req.headers.cartid, 'carts.skuid': req.body.skuid };
    let updateQuery = {'$inc': {'carts.$.qty' : Number(req.body.qty)}};
    Carts.findOneAndUpdate(findQuery, updateQuery, (err, doc) => {
      if (!doc || doc === undefined) {
        findQuery = {'cartId': req.headers.cartid };
        updateQuery = {
          'skuid': req.body.skuid,
          'devicename': req.body.devicename,
          'deviceofferprice': req.body.deviceofferprice,
          'deviceprice': req.body.deviceprice,
          'currency': req.body.currency,
          'deviceimage': req.body.deviceimage,
          'qty': req.body.qty,
        };
        Carts.findOneAndUpdate(findQuery, { $push : {carts: updateQuery }}, (err, doc) => {
            if (!doc || doc === undefined) {
              let cartsCache = [];
              cartsCache.push({
                skuid: req.body.skuid,
                devicename: req.body.devicename,
                deviceofferprice: req.body.deviceofferprice,
                deviceprice: req.body.deviceprice,
                currency: req.body.currency,
                deviceimage: req.body.deviceimage,
                qty: req.body.qty,
              });
              const carts = new Carts({
                carts: cartsCache,
                cartId : req.headers.cartid,
                dateCreated: new Date()
              });
              carts.save().then(documents => {
                if (documents) {
                  res.status(201).json({
                    message: "Successfully updated the cart!",
                    cartId: req.headers.cartid
                  });
                } else {
                  res.status(404).json({
                    message: "Couldn't update the cart.",
                    cartId: req.headers.cartid
                  });
                }
              });
            } else {
              res.status(201).json({
                message: "Successfully updated the cart!",
                cart: req.headers.cartid
              });
            }
        });
      } else {
        res.status(201).json({
          message: "Successfully updated the cart!",
          cart: req.headers.cartid
        });
      }
    });
  } else {
    res.status(404).json({'Error:': 'invalid token or token not found in your request.'});
  }
});

app.get("/api/carts", (req, res, next) => {
  if(validateToken(req.headers.cartid)) {
    Carts.findOne({'cartId': req.headers.cartid}).then(documents => {
      if (documents && documents.carts && documents.carts.length > 0) {
        res.status(200).json({
          message: "Devices fetched successfully!",
          data: documents.carts
        });
      } else {
        res.status(404).json();
      }
    });
  } else {
    res.status(404).json({'Error:': 'invalid token or token not found in your request.'});
  }
});

app.post("/api/checkout", (req, res, next) => {
  if(validateToken(req.headers.cartid)) {
    Carts.findOne({'cartId': req.headers.cartid}).then(documents => {
      if (documents && documents.carts && documents.carts.length > 0) {
        let totalAmt = 0;
        let currency = '';
        let cartsArray = [];
        documents.carts.forEach((cart, index) => {
          totalAmt += cart.deviceofferprice > 0 ? cart.deviceofferprice * cart.qty : cart.deviceprice * cart.qty;
          currency = cart.currency;
          cartsArray.push({
            skuid: cart.skuid,
            devicename: cart.devicename,
            deviceofferprice: cart.deviceofferprice,
            deviceprice: cart.deviceofferprice > 0 ? cart.deviceofferprice : cart.deviceprice,
            totalamount: cart.deviceofferprice > 0 ? cart.deviceofferprice * cart.qty : cart.deviceprice * cart.qty,
            currency: cart.currency,
            deviceimage: cart.deviceimage,
            qty: cart.qty
          });
        });
        const checkout = new Checkout({carts: cartsArray,
          customer: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zipcode: req.body.zipcode,
            email: req.body.email,
            mobile: req.body.mobile,
            totalAmount: totalAmt,
            currencyType: currency,
            dateCreated: new Date(),
            shipmentStatus: 'Yet to pack'
          }
        });
        checkout.save().then(addToCheckout => {
          if (addToCheckout) {
            Carts.deleteOne({ cartId: req.headers.cartid }, (err, doc) => {
              res.status(201).json({
                message: "Order has been placed successfully!",
                orderId: addToCheckout._id
              });
            });
          } else {
            res.status(404).json();
          }
        });
      } else {
        res.status(404).json();
      }
    });
  } else {
    res.status(404).json({'Error:': 'invalid token or token not found in your request.'});
  }
});

app.delete("/api/carts/:skuid", (req, res, next) => {
  if(validateToken(req.headers.cartid)) {
    Carts.updateOne({ 'cartId': req.headers.cartid }, { "$pull": { "carts": { "skuid": req.params.skuid } }}, { safe: true, multi:true }, (err, obj) => {
      if (obj) {
        res.status(201).json({
          message: "Successfully updated the cart!",
          cart: req.headers.cartid
        });
      } else {
        res.status(404).json(err);
      }
  });
  } else {
    res.status(404).json({'Error:': 'invalid token or token not found in your request.'});
  }
});

app.post("/api/order-status", (req, res, next) => {
  Checkout.find({"customer.email": {$regex : new RegExp(req.body.email, "i")}, "customer.mobile": req.body.mobile})
  .sort({"customer.dateCreated": -1})
  .limit(10)
  .then(documents => {
    if (documents.length > 0) {
      res.status(200).json(documents);
    } else {
      res.status(404).json({'error': 'Requested order not found.'});
    }
  });
});

module.exports = app;
