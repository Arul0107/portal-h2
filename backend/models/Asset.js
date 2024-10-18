// models/Asset.js
const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  asset_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: [String], required: true },
  condition: { type: String, required: true },
  employee_id: { type: String, required: true }, 
    employee_name: { type: String},
  department: { type: String, required: true },
  status: { type: String, enum: ['received', 'notReturned'], default: 'received' },
});

module.exports = mongoose.model('Asset', assetSchema);
