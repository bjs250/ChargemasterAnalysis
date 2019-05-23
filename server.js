const mongoose = require("mongoose");
const express = require("express");
const path = require('path');
var cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");

const app = express();
app.use(cors());
const router = express.Router();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// This is the MongoDB database
const dbRoute = "mongodb+srv://bjs250:DeltaV123@cluster0-rhktc.mongodb.net/DrugInfoDB?retryWrites=true";

// Connects back end code with the database
mongoose.connect(process.env.PROD_MONGODB ||
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// Checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

/* Main Code starts here */

router.get("/getDrugNames", (req, res) => {
  console.log("hit");
  Data.distinct("name", (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.get("/getDeliveryMethods/:drugName", (req, res) => {
  const { drugName } = req.params;
  Data.distinct("delivery", { name: drugName }, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });

});

router.get("/getDosageAmounts/", (req, res) => {
  const { drugName, deliveryMethod } = req.query;
  Data.distinct("dosage", { name: drugName, delivery: deliveryMethod }, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });

});

router.get("/getData/", (req, res) => {
  const { drugName, deliveryMethod, dosage } = req.query;

  Data.aggregate([
    {
      $match:
      {
        name: drugName,
        delivery: deliveryMethod,
        dosage: dosage
      }
    },
    {
      $group:
      {
        _id: "$hospital",
        mean_price: { $avg: "$price" },
        total_records: { $sum: 1 },
        values: { $push: "$price" },
        max_price: { $max: "$price" },
        min_price: { $min: "$price" },
        standard_deviation: { $stdDevSamp: "$price" },
        description: {$first : "$description"}

      }
    }
  ]).sort({mean_price:1}).exec(function (err, data) {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });

});

// Append /api for http requests
app.use("/api", router);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

// Launch backend into a port
app.listen(process.env.PORT || 3001, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});