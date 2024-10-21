const jwt = require("jsonwebtoken");
const Video = require("../models/Videos");
const Course = require("../models/Courses");

const CheckIfTeacherHasAccessToUpdate = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
     const course = await Course.findById(video.course_id.toString());
     
    if (course?.teacher_id?.toString() == req.teacher._id.toString()) {
      next(); 
    } else {
      
      res.status(403).json({ message: "You can not edit or delete this video" });
    }

  } catch (error) {
    
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = CheckIfTeacherHasAccessToUpdate;
