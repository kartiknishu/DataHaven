const Resource = require('../models/Resource.js');
const Comment = require('../models/Comment.js');
const User = require('../models/User.js');

const getAllResources = async (req, res) => {
    try {
        const userId = req.user.id 
        const resources = await Resource.find().populate('uploaded_by')
        res.status(200).json({message : "Resources fetched successfully!"  ,resources,userId})
    }
    catch(err) {
        console.log("Error in getting all resources!")
        res.status(500).json({message : err.message})
    }
}

const getResourceById = async (req, res) => {
    try {
        const id = req.params.id
        const resource = await Resource.findById(id).populate('uploaded_by')
        res.status(200).json({message : "Resource fetched successfully!"  ,resource})
    }
    catch(err) {
        console.log("Error in getting resource by id!")
        res.status(500).json({message : err.message})
    }
}

const addResource = async (req, res) => {
    try {

        const userId = req.user.id 
        // add the id of the user who contributed this resource
        req.body.uploaded_by = userId
        const resource = new Resource(req.body)
        await resource.save()

        // add the id of this resource to the contributed resources of the user
        const user = await User.findById(userId)
        user.contributedResources.push(resource._id)
        await user.save()

        res.status(200).json({message : "Resource added successfully!"  ,resource,user})
    }
    catch(err) {
        console.log("Error in adding resource!")
        res.status(500).json({message : err.message})
    }
}

const updateResource = async (req, res) => {
    try {
        let id = req.params.id
        
        const isExist = await Resource.findById(id).populate('uploaded_by')

        if(!isExist)
            return res.status(404).json({message : "Resource not found!"})

        const resource = await Resource.findByIdAndUpdate(id , req.body)
        res.status(200).json({message : "Resource updated successfully!"  ,resource})
    }
    catch(err) {
        console.log("Error in updating resource!")
        res.status(500).json({message : err.message})
    }
}

const LikeResource = async (req, res) => {
    try {
        let id = req.params.id
        const resource = await Resource.findById(id).populate('uploaded_by')
        if(!resource)
            return res.status(404).json({message : "Resource not found!"})

        const userId = req.user.id
        
        const userDislikeIndex = resource.peopleWhoDisliked.indexOf(userId)
        const userLikedIndex = resource.peopleWhoLiked.indexOf(userId)

        if(userLikedIndex == -1 && userDislikeIndex == -1){
            resource.peopleWhoLiked.push(userId)
            resource.likes = resource.peopleWhoLiked.length - resource.peopleWhoDisliked.length
            const updateResource = await resource.save()
            res.status(200).json({message : "Resource liked successfully!"  ,resource : updateResource})
        }
        else if(userLikedIndex != -1){
            resource.likes = resource.peopleWhoLiked.length - resource.peopleWhoDisliked.length
            res.status(200).json({message : "Resource already liked!", resource})
        }
        else{
            resource.peopleWhoDisliked.splice(userDislikeIndex, 1)
            resource.likes = resource.peopleWhoLiked.length - resource.peopleWhoDisliked.length
            const updateResource = await resource.save()
            res.status(200).json({message : "Resource neither liked nor disliked!", resource : updateResource})
        }
    }
    catch(err) {
        console.log("Error in liking resource!")
        res.status(500).json({message :"Error in liking resource!"})
    }
}

const DislikeResource = async (req, res) => {
    try {
        // console.log("Disliking resource")
        let id = req.params.id
        const resource = await Resource.findById(id).populate('uploaded_by')
        if(!resource)
            return res.status(404).json({message : "Resource not found!"})

        const userId = req.user.id

        const userLikedIndex = resource.peopleWhoLiked.indexOf(userId)
        const userDislikeIndex = resource.peopleWhoDisliked.indexOf(userId)
        // console.log("****************************************")
        // console.log("User liked index", userLikedIndex)
        // console.log("User dislike index", userDislikeIndex)

        if(userDislikeIndex == -1 && userLikedIndex == -1){
            resource.peopleWhoDisliked.push(userId)
            resource.likes = resource.peopleWhoLiked.length - resource.peopleWhoDisliked.length
            const updateResource = await resource.save()
            res.status(200).json({message : "Resource disliked successfully!"  ,resource : updateResource})
        }
        else if(userDislikeIndex != -1){
            resource.likes = resource.peopleWhoLiked.length - resource.peopleWhoDisliked.length
            res.status(200).json({message : "Resource already disliked!", resource})
        }
        else{
            resource.peopleWhoLiked.splice(userLikedIndex, 1)
            resource.likes = resource.peopleWhoLiked.length - resource.peopleWhoDisliked.length
            const updateResource = await resource.save()
            res.status(200).json({message : "Resource neither liked nor disliked!", resource : updateResource})
        }
    }
    catch(err) {
        console.log("Error in disliking resource!")
        res.status(500).json({message :"Error in disliking resource!"})
    }
}


const isLiked = async (req, res) => {
    try {
        let id = req.params.id
        const resource = await Resource.findById(id).populate('uploaded_by')
        if(!resource)
            return res.status(404).json({message : "Resource not found!"})

        const userId = req.user.id
        const userLikedIndex = resource.peopleWhoLiked.indexOf(userId)
        const userDislikeIndex = resource.peopleWhoDisliked.indexOf(userId)

        if(userLikedIndex == -1 && userDislikeIndex == -1){
            res.status(200).json({message : "Resource neither liked nor disliked!", liked : false, disliked : false})
        }
        else if(userLikedIndex != -1){
            res.status(200).json({message : "Resource liked!", liked : true, disliked : false})
        }
        else{
            res.status(200).json({message : "Resource disliked!", liked : false, disliked : true})
        }
    }
    catch(err) {
        console.log("Error in checking if resource is liked!")
        res.status(500).json({message :"Error in checking if resource is liked!"})
    }
}

const deleteResource = async (req, res) => {
    try {
        const id = req.params.id
        // console.log("ID1", id)
        
        const isExist = await Resource.findById(id)
        if(!isExist)
        return res.status(404).json({message : "Resource not found!"})
    
    const resource = await Resource.findByIdAndDelete(id)
    // const users = await User.find({ contributedResources: id });
    
    // find users where this resouce id is present in contributed resources array
    const users = await User.find({contributedResources : { $in : [id]}})
    // console.log("ID3", id)
    
    // update the contributedResources array for each user
    for (const user of users) {
        const index = user.contributedResources.indexOf(id);
        if (index !== -1) {
            user.contributedResources.splice(index, 1); // Remove the resourceId from contributedResources array
            await user.save(); // Save the user to update the database
        }
    }
    
    // find users where this resouce id is present in saved resources array
    const users2 = await User.find({savedResources : { $in : [id]}})
    
    // update the savedResources array for each user
    for (const user of users2) {
        const index = user.savedResources.indexOf(id);
        if (index !== -1) {
            user.savedResources.splice(index, 1); // Remove the resourceId from savedResources array
            await user.save(); // Save the user to update the database
        }
    }
    
    // delete the comments of this resource
    await Comment.deleteMany({resourceId : id})
    
        res.status(200).json({message : "Resource deleted successfully!"  ,resource})
    }
    catch(err) {
        console.log("Error in deleting resource!")
        res.status(500).json({message : err.message})
    }
}

const deleteAllResources = async (req, res) => {
    try {
        const resources = await Resource.deleteMany()

        // make the contributed array empty for all the users
        const users = await User.find()
        for (const user of users) {
            user.contributedResources = [];
            user.savedResources = [];
            await user.save();
        }

        res.status(200).json({message : "All resources deleted successfully!"  ,resources})
    }
    catch(err) {
        console.log("Error in deleting all resources!")
        res.status(500).json({message : err.message})
    }
}

// find top k resource with most likes
const getTopKResourcesForLikes = async (req, res) => {
    try {
        const userId = req.user.id 
        let k = parseInt(req.params.k)
        const totalResources = await Resource.countDocuments()
        k = Math.min(k, totalResources)
        const resources = await Resource.find().sort({likes : -1}).limit(k).populate("uploaded_by")
        res.status(200).json({message : "Top k resources fetched successfully!"  ,resources,userId})
    }
    catch(err) {
        console.log("Error in getting top k resources!")
        res.status(500).json({message : err.message})
    }
}

// return resources for a particular year
const getResourcesForYear = async (req, res) => {
    try {
        const year = parseInt(req.params.year)
        const resources = await Resource.find({year}).populate('uploaded_by')
        res.status(200).json({message : "Resources fetched successfully!"  ,resources})
    }
    catch(err) {
        console.log("Error in getting resources for a particular year!")
        res.status(500).json({message : err.message})
    }
}

// return resources for course code
const getResourcesForCourseCode = async (req, res) => {
    try {
        const courseCode = req.params.courseCode
        const resources = await Resource.find({courseCode}).populate('uploaded_by')
        res.status(200).json({message : "Resources fetched successfully!"  ,resources})
    }
    catch(err) {
        console.log("Error in getting resources for a particular course code!")
        res.status(500).json({message : err.message})
    }
}

const getResourcesForUser = async (req, res) => {
    try {
        const uploaded_by=req.user.id
        const resources = await Resource.find({uploaded_by}).populate('uploaded_by')
        res.status(200).json({message : "Resources fetched successfully!"  ,resources})
    }
    catch(err) {
        console.log("Error in getting resources for this user!")
        res.status(500).json({message : err.message})
    }
}

// filter the courses based on the course code, year, tags, semester
// It is possible that some of the filters are not given like course code may not be given or an empty string or course code and year are given and not tags and semester
// Basically, any permutation of the filters is possible
// So, we have to handle all the cases

const filterResources = async (req, res) => {
    try {
        const { courseCode, year, tags, semester, courseTitle, instructor } = req.query;
    
        let filter = {};
    
        if (courseCode) filter.courseCode = courseCode;
        if (year) filter.year = year;
        if (semester) filter.semester = semester;
        if (courseTitle) filter.courseTitle = courseTitle;
        if (instructor) filter.$or = [{ instructor_primary: instructor }, { instructor_secondary: instructor }];
        if (tags) filter.tags = { $all: tags };
    
        let resources = await Resource.find(filter).populate('uploaded_by');
    
        res.status(200).json({ message: "Resources fetched successfully!", resources });
    } catch (err) {
        console.log("Error in filtering resources!");
        res.status(500).json({ message: err.message });
    }
}



module.exports = {
    getAllResources,
    getResourceById,
    addResource,
    updateResource,
    deleteResource,
    deleteAllResources,
    getTopKResourcesForLikes,
    getResourcesForYear,
    getResourcesForCourseCode,
    getResourcesForUser,
    filterResources,
    LikeResource,
    DislikeResource,
    isLiked,
}
