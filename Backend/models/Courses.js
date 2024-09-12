const mongoose = require("mongoose");

const CoursesSchema = mongoose.Schema(
  {
    code : {
        type: String,
    },
    title: {
        type: String
    }
  }
);

const Courses = mongoose.model("courses", CoursesSchema);
module.exports = Courses;
