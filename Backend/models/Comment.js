const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "must provide text"],
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      required: [true, "must provide resource"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "must provide user"],
    },
    author: {
      type: String,
      required: [true, "must provide author"],
    },
    likedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    dislikedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    parent:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Comment"
    }
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
