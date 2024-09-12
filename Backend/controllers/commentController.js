const mongoose = require('mongoose')
const Comment = require('../models/Comment.js')
const Resource = require('../models/Resource.js')
const User = require('../models/User.js')

const createComment = async (req, res) => {
    try{
        // console.log("BODY",req.body)
        const {text} = req.body
        const resourceId = req.body.course_id
        const parent=req.body.parent
        // console.log("text: ", text)
        // console.log("resourceId: ", resourceId)
        const userId = req.user.id
        
        // console.log("userId: ", userId)

        if(!text)
            return res.status(400).json({message: "Text is required!"})

        if(!resourceId)
            return res.status(400).json({message: "Resource is required!"})

        if(!userId)
            return res.status(400).json({message: "User is required!"})

        // check if this resource exists
        const isResourceExist = await Resource.findById(resourceId)
        if(!isResourceExist)
            return res.status(404).json({message: "Resource not found!"})

        // check if this user exists
        const isUserExist = await User.findById(userId)
        if(!isUserExist)
            return res.status(404).json({message: "User not found!"})

        const author = isUserExist.name

        let comment = new Comment({text, resourceId, userId, author})
        if(parent){
            comment=new Comment({text,resourceId,userId,author,parent})
        }
        await comment.save()
        res.status(200).json({message: "Comment created successfully!"})
    }
    catch(err){
        console.log("Error while creating comment")
        res.status(500).json({message: err.message})
    }
}


const getAllComments = async (req, res) => {
    try{
        const comments = await Comment.find().populate('parent')
        res.status(200).json({message: "Comments fetched successfully!", comments,user:req.user.id})
    }
    catch(err){
        console.log("Error while fetching comments")
        res.status(500).json({message: err.message})
    }
}


const getCommentById = async (req, res) => {
    try{
        const id = req.params.id
        const comment = await Comment.findById(id).populate('parent')

        res.status(200).json({message: "Comment fetched successfully!", comment})
    }
    catch(err){
        console.log("Error while fetching comment by id")
        res.status(500).json({message: err.message})
    }
}


// get Comment by resource id
const getCommentByResourceId = async (req, res) => {
    try{
        const id = req.params.resourceId
        
        const comments = await Comment.find({resourceId: id}).populate('parent')
        // add profile image to each comment corresponding to the user
        const updatedComments = await Promise.all(comments.map(async (comment) => {
            const user = await User.findById(comment.userId);
            return {
                ...comment._doc,
                imageUrl: user.imageUrl
            }
        }));
        // console.log("comments",updatedComments)
        res.status(200).json({message: "Comments fetched successfully!", comments : updatedComments,user:req.user.id})
    }
    catch(err){
        console.log("Error while fetching comments by resource id")
        res.status(500).json({message: err.message})
    }
}

// get Comment by user id
const getCommentByUserId = async (req, res) => {
    try{
        const id = req.params.userId
        const comments = await Comment.find({userId: id}).populate('parent')

        res.status(200).json({message: "Comments fetched successfully!", comments})
    }
    catch(err){
        console.log("Error while fetching comments by user id")
        res.status(500).json({message: err.message})
    }
}


// get Comment by user id and resource id
const getCommentByUserIdAndResourceId = async (req, res) => {
    try{
        const userId = req.params.userId
        const resourceId = req.params.resourceId
        const comments = await Comment.find({userId: userId, resourceId: resourceId}).populate('parent')

        res.status(200).json({message: "Comments fetched successfully!", comments})
    }
    catch(err){
        console.log("Error while fetching comments by user id and resource id")
        res.status(500).json({message: err.message})
    }
}

// update Comment
const updateComment = async (req, res) => {
    try{
        const id = req.body.comment_id
        // console.log("id :",id)
       
        const userId=req.user.id
        
        const comment = await Comment.findById(id)
        const user=await User.findById(userId)
        if(!comment){
            
            return res.status(404).json({message: "Comment not found!"})
        }
        if(req.body.likedBy){
            if(!comment.likedBy.includes(userId)){
                const result = await Comment.findByIdAndUpdate(id, { $push: { likedBy: userId } },{new:true})
                
                res.status(200).json({message: "Comment updated successfully!", result})
            }
            else{
                const result = await Comment.findByIdAndUpdate(id, { $pull: { likedBy: userId } },{new:true})
                
                res.status(200).json({message: "Comment updated successfully!", result})
            }
        }
        else if(req.body.dislikedBy){
            if(!comment.dislikedBy.includes(userId)){
                const result = await Comment.findByIdAndUpdate(id, { $push: { dislikedBy: userId } },{new:true})
                
                res.status(200).json({message: "Comment updated successfully!", result})
            }
            else{
                const result = await Comment.findByIdAndUpdate(id, { $pull: { dislikedBy: userId } },{new:true})
                
                res.status(200).json({message: "Comment updated successfully!", result})
            }
        }
        else{

            const result = await Comment.findByIdAndUpdate(id,  req.body,{new:true})
            res.status(200).json({message: "Comment updated successfully!", result})
        }
    }
    catch(err){
        console.log("Error while updating comment")
        console.log(err.message)
        res.status(500).json({message: err.message})
    }
}


// delete Comment
const deleteComment = async (req, res) => {
    
    try{
        const id = req.params.id
        const userid=req.user.id

        const comment = await Comment.findById(id)

        
        // console.log(req.params)
        if(!comment)
        return res.status(404).json({message: "Comment not found!"})
    else if(comment.userId!=userid){
        return res.status(404).json({message: ""})
    }
    else{
            const deleteNestedComments = async (parentId) => {
                // Find and delete all child comments
                const childComments = await Comment.find({ parent: parentId });
                for (const childComment of childComments) {
                    await deleteNestedComments(childComment._id); // Recursively delete nested comments
                    await Comment.findByIdAndDelete(childComment._id); // Delete the child comment itself
                }
            };
        
            // Call the function to delete nested comments
            await deleteNestedComments(id);

            const result = await Comment.findByIdAndDelete(id)
            res.status(200).json({message: "Comment deleted successfully!", result})
        }

    }
    catch(err){
        console.log("Error while deleting comment")
        res.status(500).json({message: err.message})
    }
}

// delete all Comments
const deleteAllComments = async (req, res) => {
    try{
        const result = await Comment.deleteMany()
        res.status(200).json({message: "Comments deleted successfully!", result})
    }
    catch(err){
        console.log("Error while deleting comments")
        res.status(500).json({message: err.message})
    }
}

module.exports = {
    createComment,
    getAllComments,
    getCommentById,
    getCommentByResourceId,
    getCommentByUserId,
    getCommentByUserIdAndResourceId,
    updateComment,
    deleteComment,
    deleteAllComments
}
        