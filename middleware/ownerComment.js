const jwt = require("jsonwebtoken");
const Video = require("../models/Videos");
const Course = require("../models/Courses");
const Comment = require("../models/Comments");

const ownerComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
     
    if (comment?.teacher_id?.toString() == req.teacher._id.toString()) {
      next(); 
    } else {
      res.status(403).json({ message: "You can not edit or delete this comment" });
    }

  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = ownerComment;
