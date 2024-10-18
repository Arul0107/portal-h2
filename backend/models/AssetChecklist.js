// models/AssetChecklist.js
const mongoose = require("mongoose");

const assetChecklistSchema = new mongoose.Schema({
  check_list_id: {
    type: String,
    required: true,
    unique: true
  },
  check_list_category: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    required: true
  }
});

module.exports = mongoose.model("AssetChecklist", assetChecklistSchema);
