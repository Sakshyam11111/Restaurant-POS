const Designation = require('../models/Designation');

exports.getDesignations = async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = {};
    if (search) filter.designationName = { $regex: search, $options: 'i' };
    if (status) filter.status = status;

    const designations = await Designation.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', results: designations.length, data: { designations } });
  } catch (error) {
    console.error('getDesignations error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch designations' });
  }
};

exports.getDesignationById = async (req, res) => {
  try {
    const designation = await Designation.findById(req.params.id);
    if (!designation) return res.status(404).json({ status: 'error', message: 'Designation not found' });
    res.status(200).json({ status: 'success', data: { designation } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch designation' });
  }
};

exports.createDesignation = async (req, res) => {
  try {
    const { designationName, description, status } = req.body;
    if (!designationName) {
      return res.status(400).json({ status: 'error', message: 'Designation name is required' });
    }

    const designation = await Designation.create({
      designationName,
      description: description || '',
      status: status || 'Active',
      createdBy: req.user?.userId || null,
    });

    res.status(201).json({
      status: 'success',
      message: 'Designation created successfully',
      data: { designation },
    });
  } catch (error) {
    console.error('createDesignation error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to create designation' });
  }
};

exports.updateDesignation = async (req, res) => {
  try {
    const { designationName, description, status } = req.body;
    const designation = await Designation.findByIdAndUpdate(
      req.params.id,
      { designationName, description, status },
      { new: true, runValidators: true }
    );
    if (!designation) return res.status(404).json({ status: 'error', message: 'Designation not found' });
    res.status(200).json({
      status: 'success',
      message: 'Designation updated successfully',
      data: { designation },
    });
  } catch (error) {
    console.error('updateDesignation error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to update designation' });
  }
};

exports.deleteDesignation = async (req, res) => {
  try {
    const designation = await Designation.findByIdAndDelete(req.params.id);
    if (!designation) return res.status(404).json({ status: 'error', message: 'Designation not found' });
    res.status(200).json({ status: 'success', message: 'Designation deleted successfully' });
  } catch (error) {
    console.error('deleteDesignation error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete designation' });
  }
};