const Courses = require('../models/Courses.js');
const Instructors = require('../models/Instructors.js')

const getCourses = async (req, res) => {
    try {
        const courses = await Courses.find()
        res.status(200).json({message : "Courses fetched successfully!"  ,courses})
    }
    catch(err){
        console.log("Error in getting courses!")
        res.status(500).json({message : err.message})
    }
}

const getInstructors = async (req, res) => {
    try {
        const instructors = await Instructors.find()
        res.status(200).json({message : "Instructors fetched successfully!"  , instructors})
    }
    catch (err) {
        console.log("Error in getting Instructors!")
        res.status(500).json({message : err.message})
    }
}

module.exports = {
    getCourses,
    getInstructors
}
