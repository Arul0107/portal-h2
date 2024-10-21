const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  employee_id: { type: String, required: true },  // Reference to Employee ID
  submittedBy: { type: String, required: true },
  submittedTo: { type: String, required: true },
  doc_name: { type: String, required: true },
  doc_filepath: { type: String, required: true },
  doc_category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
