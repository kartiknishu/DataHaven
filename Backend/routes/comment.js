const express = require('express')
const router = express.Router()
const {
    createComment,
    getAllComments,
    getCommentById,
    getCommentByResourceId,
    getCommentByUserId,
    getCommentByUserIdAndResourceId,
    updateComment,
    deleteComment,
    deleteAllComments
} = require('../controllers/commentController.js')
const { authenticationMiddleware } = require('../middleware/auth')


router.get('/', getAllComments).get('/:id',getCommentById).get('/resource/:resourceId', authenticationMiddleware, getCommentByResourceId).get('/user/:userId', getCommentByUserId).get('/user/:userId/resource/:resourceId', getCommentByUserIdAndResourceId)
router.post('/create', authenticationMiddleware, createComment)
router.put('/update/:id',authenticationMiddleware, updateComment)
router.delete('/delete/:id',authenticationMiddleware, deleteComment).delete('/deleteAll', deleteAllComments)

module.exports = router

