const Zone = require('../models/Zone');

exports.getZones = async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = {};
    if (search) filter.zoneName = { $regex: search, $options: 'i' };
    if (status) filter.status = status;

    const zones = await Zone.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', results: zones.length, data: { zones } });
  } catch (error) {
    console.error('getZones error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch zones' });
  }
};

exports.getZoneById = async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id);
    if (!zone) return res.status(404).json({ status: 'error', message: 'Zone not found' });
    res.status(200).json({ status: 'success', data: { zone } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch zone' });
  }
};

exports.createZone = async (req, res) => {
  try {
    const { zoneName, shortCode, status } = req.body;
    if (!zoneName) {
      return res.status(400).json({ status: 'error', message: 'Zone name is required' });
    }

    const zone = await Zone.create({
      zoneName,
      shortCode: shortCode || '',
      status: status || 'Active',
      createdBy: req.user?.userId || null,
    });

    res.status(201).json({ status: 'success', message: 'Zone created successfully', data: { zone } });
  } catch (error) {
    console.error('createZone error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to create zone' });
  }
};

exports.updateZone = async (req, res) => {
  try {
    const { zoneName, shortCode, status } = req.body;
    const zone = await Zone.findByIdAndUpdate(
      req.params.id,
      { zoneName, shortCode, status },
      { new: true, runValidators: true }
    );
    if (!zone) return res.status(404).json({ status: 'error', message: 'Zone not found' });
    res.status(200).json({ status: 'success', message: 'Zone updated successfully', data: { zone } });
  } catch (error) {
    console.error('updateZone error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to update zone' });
  }
};

exports.deleteZone = async (req, res) => {
  try {
    const zone = await Zone.findByIdAndDelete(req.params.id);
    if (!zone) return res.status(404).json({ status: 'error', message: 'Zone not found' });
    res.status(200).json({ status: 'success', message: 'Zone deleted successfully' });
  } catch (error) {
    console.error('deleteZone error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete zone' });
  }
};