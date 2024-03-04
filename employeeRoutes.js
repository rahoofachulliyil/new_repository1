// employeeRoutes.js

const express = require('express');
const router = express.Router();
const Employee = require('./models/Employee');

// Fetch employees for the current user
router.get('/api/employees', async (req, res) => {
  try {
    console.error('fetching employees...');
    // Fetch employees based on the user ID in the request
    const employees = await Employee.find({ user: req.user._id });
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a new employee for the current user
router.post('/api/employees', async (req, res) => {
  try {
    // Create a new employee document with the user ID in the request
    const newEmployee = new Employee({ ...req.body, user: req.user._id });
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update an existing employee for the current user
router.put('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
