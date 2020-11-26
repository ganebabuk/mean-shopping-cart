const mongoose = require("mongoose");

//db config
mongoose.connect("mongodb+srv://<username>:<password>@cluster0-ufxfh.mongodb.net/<dbname>?retryWrites=true&w=majority", { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log("Connected to Database.");
})
.catch(() => {
  console.log("Could not connect to Database.");
});
