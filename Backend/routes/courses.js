const express = require('express')
const router = express.Router()
const { authenticationMiddleware } = require('../middleware/auth.js')
const {getCourses, getInstructors} = require('../controllers/coursesController.js')

router.get('/getCourses',authenticationMiddleware,getCourses)
router.get('/getInstructors',authenticationMiddleware,getInstructors)

module.exports = router