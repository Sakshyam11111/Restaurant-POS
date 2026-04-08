const Employee = require('../models/Employee');

exports.getEmployees = async (req, res) => {
  try {
    const { search, status, department, designation } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { fullName:    { $regex: search, $options: 'i' } },
        { email:       { $regex: search, $options: 'i' } },
        { department:  { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
      ];
    }
    if (status)      filter.status      = status;
    if (department)  filter.department  = department;
    if (designation) filter.designation = designation;

    // Exclude heavy photo field from list queries for performance
    const employees = await Employee.find(filter)
      .select('-photo')
      .sort({ createdAt: -1 });

    res.status(200).json({ status: 'success', results: employees.length, data: { employees } });
  } catch (error) {
    console.error('getEmployees error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch employees' });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ status: 'error', message: 'Employee not found' });
    res.status(200).json({ status: 'success', data: { employee } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch employee' });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const {
      fullName, gender, address, email, contactNumber,
      dateOfBirth, joiningDate, education, designation,
      department, status, panNumber, description, username, photo,
    } = req.body;

    if (!fullName) {
      return res.status(400).json({ status: 'error', message: 'Full name is required' });
    }

    const employee = await Employee.create({
      fullName, gender, address, email, contactNumber,
      dateOfBirth, joiningDate, education, designation,
      department, status: status || 'Active', panNumber,
      description, username, photo: photo || '',
      createdBy: req.user?.userId || null,
    });

    // Don't return the photo in the response to keep payload small
    const result = employee.toObject();
    delete result.photo;

    res.status(201).json({
      status: 'success',
      message: 'Employee created successfully',
      data: { employee: result },
    });
  } catch (error) {
    console.error('createEmployee error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to create employee' });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const {
      fullName, gender, address, email, contactNumber,
      dateOfBirth, joiningDate, education, designation,
      department, status, panNumber, description, username, photo,
    } = req.body;

    const updateData = {
      fullName, gender, address, email, contactNumber,
      dateOfBirth, joiningDate, education, designation,
      department, status, panNumber, description, username,
    };
    // Only update photo if a new one is provided
    if (photo) updateData.photo = photo;

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-photo');

    if (!employee) return res.status(404).json({ status: 'error', message: 'Employee not found' });

    res.status(200).json({
      status: 'success',
      message: 'Employee updated successfully',
      data: { employee },
    });
  } catch (error) {
    console.error('updateEmployee error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to update employee' });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ status: 'error', message: 'Employee not found' });
    res.status(200).json({ status: 'success', message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('deleteEmployee error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete employee' });
  }
};