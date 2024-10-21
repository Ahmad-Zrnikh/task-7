const express = require("express");
const Comment = require("../models/Comments");
const authMiddleware = require("../middleware/auth");
const ownerComment = require("../middleware/ownerComment");
const router = express.Router();
const Video = require("../models/Videos");
const Course = require("../models/Courses");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const comments = await Comment.find().populate("video_id");
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const comment = await Comment.findById(id).populate("video_id");
      if (!comment) {
        return res.status(404).json({ message: "comment not found" });
      }
      res.status(200).json(comment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

router.post("/", authMiddleware, async (req, res) => {

    try {
    const video = await Video.findById(req.body.video_id);
    if (!video) {
      return res.status(404).json({ message: "video not found" });
    }
  } catch (error) {
    res.status(404).json({ message: "video not found" });
  }

  try {
    const comment = new Comment({
        content: req.body.content,
        video_id: req.body.video_id,
        teacher_id: req.teacher._id,
      });
      await comment.save();
      const video = await Video.findById(req.body.video_id);
      video.comments.push(comment);
      await video.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", authMiddleware,ownerComment, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, 
        {
            content : req.body.content
        }
        , {
      new: true,
      runValidators: true,
    });

    if (!comment) {
      return res.status(404).json({ message: "comment not found" });
    }
const video = await Video.findById(comment.video_id);
const commentIndex = video.comments.findIndex((c) => c._id.toString() == req.params.id);
video.comments[commentIndex].content = req.body.content;

    res.status(200).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", authMiddleware,ownerComment, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    console.log(comment)
    if (!comment) {
      return res.status(404).json({ message: "comment not found" });
    }
    const video = await Video.findById(comment.video_id);
video.comments.filter((c) => c._id.toString()!== req.params.id);
    res.status(200).json({ message: "comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
