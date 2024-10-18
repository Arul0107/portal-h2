// models/EmployeeBankDetails.js
const mongoose = require("mongoose");

const employeeBankDetailsSchema = new mongoose.Schema({
  bank_details_id: {
    type: String,
    required: true,
    unique: true
  },
  Acc_no: {
    type: String,
    required: true
  },
  branch_name: {
    type: String,
    required: true
  },
  ifsc_code: {
    type: String,
    required: true
  },
  micr_code: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("EmployeeBankDetails", employeeBankDetailsSchema);
