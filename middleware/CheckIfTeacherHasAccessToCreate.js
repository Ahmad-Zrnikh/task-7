const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher");
const Course = require("../models/Courses");

const CheckIfTeacherHasAccessToCreate = async (req, res, next) => {
  try {
    const course = await Course.findById(req.body.course_id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (course?.teacher_id?.toString() == req.teacher._id.toString()) {
      next(); 
    } else {
      
      res.status(403).json({ message: "You can not create this video" });
    }

  } catch (error) {
    
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = CheckIfTeacherHasAccessToCreate;
