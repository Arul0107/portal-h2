const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  asset_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: [String], default: [] },
  condition: { type: String, default: 'New' },
  employee_id: { type: String, required: true },
  employee_name: { type: String, required: true },
  department: { type: String, required: true },
  status: { type: String, default: 'received' },
});

const Asset = mongoose.model('Asset', assetSchema);
