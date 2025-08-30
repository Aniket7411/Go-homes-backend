const adminService = require("../services/admin.service");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await adminService.fetchAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getAllProperties = async (req, res) => {
    try {
      const properties = await adminService.getAllProperties();
      return res.status(200).json({ success: true, data: properties });
    } catch (error) {
      console.error("Error in getAllProperties:", error.message);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };

  exports.updatePropertyStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      if (!status) {
        return res.status(400).json({ success: false, message: "Status is required" });
      }
  
      const updated = await adminService.updatePropertyStatus(id, status);
      if (!updated) {
        return res.status(404).json({ success: false, message: "Property not found" });
      }
  
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.error("Error updating property status:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };

  exports.getDashboardStats = async (req, res) => {
    try {
      const stats = await adminService.fetchDashboardStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };

  exports.getAllLoans = async (req, res) => {
  try {
    const loans = await adminService.getAllLoansWithUsers();
    res.status(200).json({ success: true, data: loans });
  } catch (error) {
    console.error("Error fetching loans:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProperty = await adminService.hardDeleteProperty(id);

    if (!deletedProperty) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    res.status(200).json({ success: true, message: "Property permanently deleted", data: deletedProperty });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
