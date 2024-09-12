const mongoose = require("mongoose");

const InstructorsSchema = mongoose.Schema(
  {
    code : {
        type: String,
    },
    title: {
        type: String
    }
  }
);

const Instructors = mongoose.model("instructors", InstructorsSchema);
module.exports = Instructors;
