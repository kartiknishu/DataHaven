const User = require('../models/User.js')
const Resource = require('../models/Resource.js')
const Comment = require('../models/Comment.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const cron = require('node-cron');
const dotenv = require('dotenv');
const cookie = require('cookie');
dotenv.config();

const googleAuth = async (req, res) => {
    const client = new OAuth2Client(process.env.CLIENT_ID);
    const { authId } = req.body;
    // console.log('sahil', authId)
    try {
        //check if passed token is valid
        const ticket = await client.verifyIdToken({
            idToken: authId,
            audience: process.env.CLIENT_ID
        });
        //get metadata from the id token, to be saved in the db
        const { name, email, picture } = ticket.getPayload();

        //check if user already exists
        const user = await User.findOne({ email });
        let id = 'sahil';
        if (!user) {
            const yearMatch = email.match(/^(\d{4})/);
            const year = yearMatch ? yearMatch[1] : null;

            const newUser = await User.create({
                name,
                email,
                year: year,
                imageUrl: picture
            });
            id = newUser._id;
        } else {
            id = user._id;
        }
        const token = jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '1d' })
        // res.cookie('_auth_resource_tkn', token, {
        //     httpOnly: true,
        //     maxAge: 24 * 60 * 60 * 1000, // Cookie expires in 1 day
        //     path: '/',
        //     sameSite: 'none',
        //     secure: true,
        //     domain: process.env.NODE_ENV === 'development' ? '.localhost' : 'infonest.vercel.app'
        // });

        const cookies = cookie.serialize("token", token, {
            maxAge: 60 * 60 * 24,
        });
        // console.log("Cookies: ", cookies)
        // console.log("User logged in successfully")
        res.status(200).json({ message: "User logged in successfully", token, user, cookies })
    }
    catch (err) {
        console.log("Error while logging in user")
        res.status(500).json({ message: "Error in google login" })
    }
}


const registerUser = async (req, res) => {
    const { name, email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User already exists" })
        }

        const newUser = new User(req.body)
        await newUser.save()

        const data = await User.findOne({ email })
        return res.status(201).json({ message: "User registered successfully", data })
    }
    catch (err) {
        console.log("Error while registering user")
        res.status(500).json({ message: err.message })
    }
}


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            console.log("Email or password is missing")
            return res.status(400).json({ message: "Email or password is missing" })
        }
        const user = await User.findOne({ email })
        if (!user) {
            console.log("User not found")
            return res.status(404).json({ message: "User not found" })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            console.log("Password is incorrect")
            return res.status(401).json({ message: "Password is incorrect" })
        }
        const id = user._id
        const token = jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.cookie('_auth_resource_tkn', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // Cookie expires in 1 day
            path: '/',
            domain: process.env.NODE_ENV === 'development' ? '.localhost' : 'infonest.vercel.app'
        });
        res.status(200).json({ message: "User logged in successfully", token })
    }
    catch (err) {
        console.log("Error while logging in user")
        res.status(500).json({ message: "Error while logging in user" })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json({ message: "All users fetched successfully", users })
    }
    catch (err) {
        console.log("Error while getting all users")
        res.status(500).json({ message: err.message })
    }
}

const getUserById = async (req, res) => {
    try {
        let id = req.user.id

        if (req.query.user) id = req.query.user
        const user = await User.findById(id)

        if (!user) {
            console.log("User not found")
            res.status(404).json({ message: "User not found" })
        }
        res.status(200).json({ message: "User fetched successfully", user })
    }
    catch (err) {
        console.log("Error while getting user by id")
        res.status(500).json({ message: err.message })
    }
}


const updateUser = async (req, res) => {
    try {
        const id = req.user.id
        const user = await User.findById(id)

        if (!user) {
            console.log("User not found")
            res.status(404).json({ message: "User not found" })
        }

        // check if req.body contains password and if contains password then hash it
        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashedPassword;
        }

        // if username is updated, update the author field of all comments where the userId matches
        if (req.body.name) {
            const comments = await Comment.find({ userId: id });
            for (const comment of comments) {
                comment.author = req.body.name;
                await comment.save();
            }
        }

        const newUser = { ...user._doc, ...req.body }

        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true })
        // console.log(updatedUser)
        res.status(200).json({ message: "User updated successfully", updatedUser })
    }
    catch (err) {
        console.log("Error while updating user")
        res.status(500).json({ message: err.message })
    }
}


const deleteUser = async (req, res) => {
    try {
        const id = req.user.id
        const user = await User.findById(id)

        if (!user) {
            console.log("User not found")
            res.status(404).json({ message: "User not found" })
        }

        const deletedUser = await User.findByIdAndDelete(id)

        // delete resources contributed by the user
        await Resource.deleteMany({ uploaded_by: id })

        // delete comments by the user
        await Comment.deleteMany({ userId: id })

        // delete from who liked and who disliked in resources
        const resources = await Resource.find()
        for (const resource of resources) {
            if (resource.peopleWhoLiked.has(id)) {
                resource.peopleWhoLiked.delete(id);
                resource.likes = resource.peopleWhoLiked.size;
                await resource.save();
            }
            if (resource.peopleWhoDisliked.has(id)) {
                resource.peopleWhoDisliked.delete(id);
                resource.likes -= resource.peopleWhoDisliked.size;
                await resource.save();
            }
        }
        

        res.status(200).json({ message: "User deleted successfully", deletedUser })
    }
    catch (err) {
        console.log("Error while deleting user")
        res.status(500).json({ message: err.message })
    }
}


// // return the min(5,number of users) sorted by length of contributedResources array
// const topContributors = async (req, res) => {
//     try {
//         // const topContributors = await User.find().sort({contributedResources: -1}).limit(5)

//         const users = await User.find();

//         // Sort users based on the length of contributedResources array
//         const calculateTotalLikes = async (contributedResources) => {
//             let totalLikes = 0;
//             for (const element of contributedResources) {
//                 let res = await Resource.findById(element);
//                 if (res)
//                     totalLikes += res.likes;
//             }
//             return totalLikes;
//         };

//         // Sort users based on the total likes of their contributed resources
//         const sortedUsers = await Promise.all(users.map(async (user) => {

//             const totalLikes = await calculateTotalLikes(user.contributedResources);

//             return { ...user._doc, totalLikes };
//         }));
//         // console.log(sortedUsers)
//         sortedUsers.sort((a, b) => {
//             if (b.totalLikes != a.totalLikes) return b.totalLikes - a.totalLikes
//             else return b.contributedResources.length - a.contributedResources.length;
//         });

//         // Take the top 5 contributors
//         // const topContributors = sortedUsers.slice(0, 5);

//         // console.log(topContributors)
//         // sortedUsers.forEach(e=>console.log(e.name,e.totalLikes))
//         // const contributorsWithContributions = sortedUsers.map(user => ({
//         //     ...user._doc,
//         //     contributions: user.contributedResources.length,
//         // }));

//         res.status(200).json({ message: "Top contributors fetched successfully", sortedUsers })
//     }
//     catch (err) {
//         console.log("Error while getting top contributors")
//         console.log(err.message)
//         res.status(500).json({ message: err.message })
//     }
// }

let sortedUsers = []; // Define sortedUsers in a shared scope

// Schedule the task to run every 5 days
// Function to execute your code block
const executeCodeBlock = async () => {
    try {
        console.log('Counting and sorting process started...');

        const users = await User.find();

        // Sort users based on the length of contributedResources array
        const calculateTotalLikes = async (contributedResources) => {
            let totalLikes = 0;
            for (const element of contributedResources) {
                let res = await Resource.findById(element);
                if (res)
                    totalLikes += res.likes;
            }
            return totalLikes;
        };

        // Sort users based on the total likes of their contributed resources
        sortedUsers = await Promise.all(users.map(async (user) => {
            const totalLikes = await calculateTotalLikes(user.contributedResources);
            user.rating = totalLikes;
            await user.save();
            return { ...user._doc, totalLikes };
        }));

        sortedUsers.sort((a, b) => {
            if (b.totalLikes != a.totalLikes) return b.totalLikes - a.totalLikes
            else return b.contributedResources.length - a.contributedResources.length;
        });

        console.log('Counting and sorting process completed...', sortedUsers);
    } catch (error) {
        console.error('Error during counting and sorting process:', error);
    }
};

// Function to run the code block and set up the cron job
const startServer = async () => {
    // Execute the code block immediately when the server starts
    await executeCodeBlock();

    // Set up a cron job to run the code block every 20 minutes
    cron.schedule('*/20 * * * *', async () => {
        await executeCodeBlock();
    });
};

// Start the server
startServer();

// Function to fetch top contributors
const topContributors = async (req, res) => {
    try {
        // console.log('******************SORTED USERS : ******************************************************************', sortedUsers);
        // Fetch the top 5 contributors from the already sorted list
        // const top5Contributors = sortedUsers.length > 0 ? sortedUsers.slice(0, Math.min(5, sortedUsers.length)) : [];
        res.status(200).json({ message: "Top contributors fetched successfully", sortedUsers });
    } catch (error) {
        console.error('Error while getting top contributors:', error);
        res.status(500).json({ message: error.message });
    }
};

// check wheter the given course is present in savedResources or not
// savedResources is an array of resource ids
// if present the set isBookmarked to true else false
const isBookmarked = async (req, res) => {
    const resourceId = req.params.id
    const userId = req.user.id
    try {
        const user = await User.findById(userId)
        if (!user) {
            console.log("User not found")
            res.status(404).json({ message: "User not found" })
        }
        const isBookmarked = user.savedResources.includes(resourceId)
        res.status(200).json({ message: "Is bookmarked fetched successfully", isBookmarked })
    }
    catch (err) {
        console.log("Error while getting is bookmarked")
        res.status(500).json({ message: err.message })
    }
}


// save the given course in savedResources array
// savedResources is an array of resource ids
const saveResource = async (req, res) => {
    const resourceId = req.params.id
    const userId = req.user.id
    try {
        const user = await User.findById(userId)
        if (!user) {
            console.log("User not found")
            res.status(404).json({ message: "User not found" })
        }
        const savedResources = user.savedResources
        // if not present then push it
        if (!savedResources.includes(resourceId)) {
            savedResources.push(resourceId)
        }
        const updatedUser = await User.findByIdAndUpdate(userId, { savedResources }, { new: true })
        res.status(200).json({ message: "Resource saved successfully", updatedUser })
    }
    catch (err) {
        console.log("Error while saving resource")
        res.status(500).json({ message: err.message })
    }
}

// remove from save resource
// check if the resource exists in savedResources array
// if exists then remove it
const removeSavedResource = async (req, res) => {
    const resourceId = req.params.id
    const userId = req.user.id
    try {
        const user = await User.findById(userId)
        if (!user) {
            console.log("User not found")
            res.status(404).json({ message: "User not found" })
        }
        const savedResources = user.savedResources
        const index = savedResources.indexOf(resourceId)
        if (index > -1) {
            savedResources.splice(index, 1)
        }
        const updatedUser = await User.findByIdAndUpdate(userId, { savedResources }, { new: true })
        res.status(200).json({ message: "Resource removed successfully", updatedUser })
    }
    catch (err) {
        console.log("Error while removing resource")
        res.status(500).json({ message: err.message })
    }
}


const removeContributedResource = async (req, res) => {
    const resourceId = req.params.id
    const userId = req.user.id
    try {
        const user = await User.findById(userId)
        if (!user) {
            console.log("User not found")
            res.status(404).json({ message: "User not found" })
        }
        const contributedResources = user.contributedResources
        const index = contributedResources.indexOf(resourceId)
        if (index > -1) {
            contributedResources.splice(index, 1)
        }
        const updatedUser = await User.findByIdAndUpdate(userId, { contributedResources }, { new: true })
        res.status(200).json({ message: "Resource removed successfully", updatedUser })
    }
    catch (err) {
        console.log("Error while removing resource")
        res.status(500).json({ message: err.message })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('_auth_resource_tkn');
        res.status(200).json({ message: "User logged out successfully" })
    }
    catch (err) {
        console.log("Error while logging out user")
        res.status(500).json({ message: err.message })
    }
}

// get saved resources
const getSavedResources = async (req, res) => {
    const userId = req.user.id
    try {
        const user = await User.findById(userId)
        if (!user) {
            console.log("User not found")
            res.status(404).json({ message: "User not found" })
        }
        const savedResources = user.savedResources
        // console.log("SavedResources ", savedResources)
        // get all the saved resources
        const savedResourcesData = await Resource.find({ _id: { $in: user.savedResources } })
        // console.log("SavedResourceData", savedResourcesData)

        const updatedResourceData = await Promise.all(
            savedResourcesData.map(async (resource) => {
                const uploadedUser = await User.findById(resource.uploaded_by);
                return {
                    ...resource._doc,
                    uploadedBy: uploadedUser ? uploadedUser.name : "Unknown",
                };
            })
        );

        // console.log("Saved Resources Data ", updatedResourceData)
        res.status(200).json({ message: "Saved resources fetched successfully", updatedResourceData })
    }
    catch (err) {
        console.log("Error while getting saved resources")
        res.status(500).json({ message: err.message })
    }
}


const getContributedResources = async (req, res) => {
    const userId = req.user.id
    try {
        const user = await User.findById(userId)
        if (!user) {
            console.log("User not found")
            res.status(404).json({ message: "User not found" })
        }
        const contributedResources = user.contributedResources
        // console.log("Saved Resources ", contributedResources)
        // get all the saved resources
        const contributedResourcesData = await Resource.find({ _id: { $in: user.contributedResources } })
        // console.log("Saved Resourcd Data ", contributedResourcesData)

        const updatedResourceData = await Promise.all(
            contributedResourcesData.map(async (resource) => {
                const uploadedUser = await User.findById(resource.uploaded_by);
                return {
                    ...resource._doc,
                    uploadedBy: uploadedUser ? uploadedUser.name : "Unknown",
                };
            })
        );

        // console.log("Saved Resources Data ", resourceDataWithUploadedBy)
        res.status(200).json({ message: "Contributed resources fetched successfully", updatedResourceData })
    }
    catch (err) {
        console.log("Error while getting contributed resources")
        res.status(500).json({ message: err.message })
    }
}

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    topContributors,
    isBookmarked,
    saveResource,
    removeSavedResource,
    getSavedResources,
    getContributedResources,
    removeContributedResource,
    logoutUser,
    googleAuth
}
