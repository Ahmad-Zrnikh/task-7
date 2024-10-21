const express = require("express");
const Course = require("../models/Courses");
const Teacher = require("../models/Teacher");
const authMiddleware = require("../middleware/auth");
const checkIfTeacherHasAccess = require("../middleware/checkIfTeacherHasAccess");
const router = express.Router();
const Video = require("../models/Videos");
const Comment = require("../models/Comments");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const courses = await Course.find().populate("teacher_id").populate("videos");
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id).populate("teacher_id").populate("videos");
    if (!course) {
      return res.status(404).json({ message: "course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post("/", authMiddleware, async (req, res) => {

  try {
    const course = new Course({
      title: req.body.title,
      description: req.body.description,
      time: req.body.time,
      teacher_id: req.teacher._id,
    });

    await course.save();

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", authMiddleware, checkIfTeacherHasAccess, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        time: req.body.time,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", authMiddleware, checkIfTeacherHasAccess, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "course not found" });
    }
    const videos = await Video.find({course_id : course._id});
    if(videos.length > 0){
      for (const video of videos){
        const comment = await Comment.find({video_id : video._id});
        if(comment.length > 0){
      await Comment.deleteMany({video_id : video._id});
    }
      await Video.deleteMany({course_id : course._id});
      }
    }
  await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
