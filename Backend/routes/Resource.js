const express = require('express')
const router = express.Router()
const { authenticationMiddleware } = require('../middleware/auth.js')
const {getAllResources, getResourceById, addResource , updateResource, deleteResource, deleteAllResources, getTopKResourcesForLikes, getResourcesForYear, getResourcesForCourseCode,getResourcesForUser, filterResources, LikeResource, DislikeResource, isLiked} = require('../controllers/resourceController.js')

router.get('/',authenticationMiddleware,getAllResources).get('/top/:k',authenticationMiddleware,getTopKResourcesForLikes).get('/year/:year',authenticationMiddleware,getResourcesForYear).get('/course/:courseCode',authenticationMiddleware,getResourcesForCourseCode).get('/course',authenticationMiddleware,getResourcesForUser)
router.post('/add',authenticationMiddleware,addResource)
router.put('/update/:id',authenticationMiddleware,updateResource)
router.delete('/delete/:id',authenticationMiddleware,deleteResource);
router.get('/filterResources',authenticationMiddleware,filterResources)
router.get('/:id',authenticationMiddleware,getResourceById)
router.put('/like/:id',authenticationMiddleware,LikeResource)
router.put('/dislike/:id',authenticationMiddleware,DislikeResource)
router.get('/isLiked/:id',authenticationMiddleware,isLiked)


module.exports = router
