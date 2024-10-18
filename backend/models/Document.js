const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  doc_id: {
    type: String,
    required: true,
    unique: true
  },
  employee_id: { // <-- Add this field
    type: String,
    required: true
  },
  doc_category: {
    type: String,
    required: true
  },
  doc_name: {
    type: String,
    required: true
  },
  doc_filepath: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Document", documentSchema);
