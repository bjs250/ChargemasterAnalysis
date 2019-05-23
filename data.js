const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DataSchema = new Schema(
  {
    id: Number,
    name: String,
    price: Number,
    hospital: String,
    delivery: String,
    dosage: String,
    description: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("DrugInfo", DataSchema,"DrugInfoStore");