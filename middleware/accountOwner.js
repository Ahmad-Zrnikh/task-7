const Teacher = require("../models/Teacher");

const accountOwner = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    if (teacher?._id?.toString() == req.teacher._id.toString()) {
      next(); 
    } else {
      res.status(403).json({ message: "You can not edit or delete this teacher account" });
    }

  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = accountOwner;
