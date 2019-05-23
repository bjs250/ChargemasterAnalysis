const mongoose = require("mongoose");
const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// this is our MongoDB database
const dbRoute = "mongodb+srv://bjs250:DeltaV123@cluster0-rhktc.mongodb.net/DrugInfoDB?retryWrites=true";

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

/* Main Code starts here */

router.get("/getDrugNames", (req, res) => {
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

  // Data.find({name: drugName, delivery: deliveryMethod, dosage: dosage}).sort({price:1}).exec(function(err, data){
  //   if (err) return res.json({ success: false, error: err });
  //   return res.json({ success: true, data: data });
  // });

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
        standard_deviation: { $stdDevSamp: "$price" }


      }
    }
  ]).sort({mean_price:1}).exec(function (err, data) {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });

});

/* 
router.get("/getData", (req, res) => {
  Data.find((err, data) => {
    console.log("=====",data)
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.post("/updateData", (req, res) => {
  const { id, update } = req.body;
  Data.findOneAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.delete("/deleteData", (req, res) => {
  const { id } = req.body;
  Data.findOneAndDelete(id, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

router.post("/putData", (req, res) => {
  let data = new Data();

  const { id, message } = req.body;

  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.message = message;
  data.id = id;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
}); */

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));