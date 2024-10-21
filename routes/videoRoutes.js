const express = require("express");
const Video = require("../models/Videos");
const authMiddleware = require("../middleware/auth");
const router = express.Router();
const checkIfTeacherHasAccess = require("../middleware/checkIfTeacherHasAccess");
const CheckIfTeacherHasAccessToCreate = require("../middleware/CheckIfTeacherHasAccessToCreate");
const CheckIfTeacherHasAccessToUpdate = require("../middleware/CheckIfTeacherHasAccessToUpdate");
const Course = require("../models/Courses");
const Teacher = require("../models/Teacher");
const Comment = require("../models/Comments");


router.get("/", authMiddleware, async (req, res) => {
  try {
    const videos = await Video.find().populate("course_id").populate("comments");
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id).populate("course_id").populate("comments");
    if (!video) {
      return res.status(404).json({ message: "video not found" });
    }
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post("/", authMiddleware,CheckIfTeacherHasAccessToCreate , async (req, res) => {

  try {
    const video = new Video(req.body);

    await video.save();
const course = await Course.findById(req.body.course_id);
course.videos.push(video);
await course.save();
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", authMiddleware,CheckIfTeacherHasAccessToUpdate, async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, 
      {
        title: req.body.title,
        description: req.body.description,
      },
{
      new: true,
      runValidators: true,
    });

    if (!video) {
      return res.status(404).json({ message: "video not found" });
    }
const course = await Course.findById(video.course_id);
const courseIndex = course.videos.findIndex((v) => v._id.toString() == req.params.id);
course.videos[courseIndex].title = req.body.title;
course.videos[courseIndex].description = req.body.description;

    res.status(200).json(video);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", authMiddleware,CheckIfTeacherHasAccessToUpdate , async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "video not found" });
    }
    const comment = await Comment.find({video_id : video._id});
    if(comment.length > 0){
  await Comment.deleteMany({video_id : video._id});
}
await Video.findByIdAndDelete(req.params.id);
const course = await Course.findById(video.course_id);

    res.status(200).json({ message: "video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
