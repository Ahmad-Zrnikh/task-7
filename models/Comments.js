const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    video_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true,
      },
      teacher_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true,
      }
    
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
