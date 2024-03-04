// Employee.js

const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  image: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String },
  designation: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  course: { type: String },
  createdDate: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
