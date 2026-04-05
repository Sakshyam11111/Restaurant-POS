// backend/controllers/tableController.js
const Table = require("../models/Table");

exports.initializeTables = async (req, res) => {
  try {
    const tableCount = await Table.countDocuments();
    if (tableCount === 0) {
      const tables = [];
      let tableCounter = 1;
      const floors = ["First Floor", "Second Floor"];
      floors.forEach((floor) => {
        for (let i = 0; i < 15; i++) {
          tables.push({
            tableId: tableCounter++,
            status: "available",
            floor,
            createdBy: req.user?.userId,
          });
        }
      });
      await Table.insertMany(tables);
      return res.status(201).json({
        status: "success",
        message: "Tables initialized successfully",
        data: { count: 30 },
      });
    }
    res.status(200).json({
      status: "success",
      message: "Tables already initialized",
      data: { count: tableCount },
    });
  } catch (error) {
    console.error("Initialize Tables Error:", error);
    res.status(500).json({ status: "error", message: "Failed to initialize tables" });
  }
};

exports.getAllTables = async (req, res) => {
  try {
    const { floor } = req.query;
    const filter = floor ? { floor } : {};
    const tables = await Table.find(filter).sort({ tableId: 1 });
    res.status(200).json({
      status: "success",
      results: tables.length,
      data: { tables },
    });
  } catch (error) {
    console.error("Get Tables Error:", error);
    res.status(500).json({ status: "error", message: "Failed to fetch tables" });
  }
};

exports.updateTableStatus = async (req, res) => {
  try {
    const { tableId } = req.params;
    const { status, reservedBy } = req.body;
    const validStatuses = ["available", "reserved", "on-dine", "split", "merge"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: "error",
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }
    const updateData = { status, lastUpdatedBy: req.user?.userId };
    if (status === "reserved" && reservedBy) updateData.reservedBy = reservedBy;
    if (status === "available") {
      updateData.reservedBy = null;
      updateData.currentOrder = null;
    }
    const table = await Table.findOneAndUpdate(
      { tableId: parseInt(tableId) },
      updateData,
      { new: true, runValidators: true }
    );
    if (!table) return res.status(404).json({ status: "error", message: "Table not found" });
    res.status(200).json({ status: "success", message: "Table status updated successfully", data: { table } });
  } catch (error) {
    console.error("Update Table Error:", error);
    res.status(500).json({ status: "error", message: "Failed to update table status" });
  }
};

exports.reserveTable = async (req, res) => {
  try {
    const { tableId } = req.params;
    const { guestName, guestPhone, reservationTime, partySize } = req.body;
    if (!guestName || !guestPhone) {
      return res.status(400).json({ status: "error", message: "Guest name and phone are required" });
    }
    const table = await Table.findOne({ tableId: parseInt(tableId) });
    if (!table) return res.status(404).json({ status: "error", message: "Table not found" });
    if (table.status !== "available") {
      return res.status(400).json({ status: "error", message: `Table is currently ${table.status}` });
    }
    table.status = "reserved";
    table.reservedBy = { guestName, guestPhone, reservationTime: reservationTime || new Date(), partySize: partySize || 1 };
    table.lastUpdatedBy = req.user?.userId;
    await table.save();
    res.status(200).json({ status: "success", message: "Table reserved successfully", data: { table } });
  } catch (error) {
    console.error("Reserve Table Error:", error);
    res.status(500).json({ status: "error", message: "Failed to reserve table" });
  }
};

exports.cancelReservation = async (req, res) => {
  try {
    const { tableId } = req.params;
    const table = await Table.findOneAndUpdate(
      { tableId: parseInt(tableId) },
      { status: "available", reservedBy: null, lastUpdatedBy: req.user?.userId },
      { new: true }
    );
    if (!table) return res.status(404).json({ status: "error", message: "Table not found" });
    res.status(200).json({ status: "success", message: "Reservation cancelled successfully", data: { table } });
  } catch (error) {
    console.error("Cancel Reservation Error:", error);
    res.status(500).json({ status: "error", message: "Failed to cancel reservation" });
  }
};

exports.startDining = async (req, res) => {
  try {
    const { tableId } = req.params;
    const table = await Table.findOne({ tableId: parseInt(tableId) });
    if (!table) return res.status(404).json({ status: "error", message: "Table not found" });
    if (table.status === "on-dine") {
      return res.status(400).json({ status: "error", message: "Table is already in use" });
    }
    table.status = "on-dine";
    table.reservedBy = null;       // clear any reservation when dining starts
    table.lastUpdatedBy = req.user?.userId;
    await table.save();
    res.status(200).json({ status: "success", message: "Dining started successfully", data: { table } });
  } catch (error) {
    console.error("Start Dining Error:", error);
    res.status(500).json({ status: "error", message: "Failed to start dining" });
  }
};

// FIX: new endpoint — called by orderController after creating an order
// so currentOrder is actually written to the table document
exports.linkOrderToTable = async (req, res) => {
  try {
    const { tableId } = req.params;
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ status: "error", message: "orderId is required" });
    }
    const table = await Table.findOneAndUpdate(
      { tableId: parseInt(tableId) },
      { currentOrder: orderId, lastUpdatedBy: req.user?.userId },
      { new: true }
    );
    if (!table) return res.status(404).json({ status: "error", message: "Table not found" });
    res.status(200).json({ status: "success", message: "Order linked to table", data: { table } });
  } catch (error) {
    console.error("Link Order Error:", error);
    res.status(500).json({ status: "error", message: "Failed to link order to table" });
  }
};

exports.endDining = async (req, res) => {
  try {
    const { tableId } = req.params;
    const table = await Table.findOneAndUpdate(
      { tableId: parseInt(tableId) },
      {
        status: "available",
        reservedBy: null,
        currentOrder: null,       // clears the linked order on checkout
        lastUpdatedBy: req.user?.userId,
      },
      { new: true }
    );
    if (!table) return res.status(404).json({ status: "error", message: "Table not found" });
    res.status(200).json({ status: "success", message: "Dining ended successfully", data: { table } });
  } catch (error) {
    console.error("End Dining Error:", error);
    res.status(500).json({ status: "error", message: "Failed to end dining" });
  }
};