const mongoose = require('mongoose')

const ResourceSchema = mongoose.Schema({
    link : {
        type: String,
        required : [true, 'must provide link']
    },
    year: {
        type: String,
        required : [true, 'must provide year']
    },
    semester: {
        type: String,
        required : [true, 'must provide semester']
    },
    courseCode: {
        type: String,
        required : [true, 'must provide course code']
    },
    courseTitle: {
        type: String,
        required : [true, 'must provide course title']
    },
    instructor_primary: {
        type: String,
        required : [true, 'must provide instructor']
    },
    instructor_secondary: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: function () {
            return `Resource of course ${this.courseCode || 'unknown'}`;
        }
    },
    likes: {
        type: Number,
        default: 0
    },
    peopleWhoLiked: [String],
    peopleWhoDisliked: [String],
    tags: {
        type: Array,
        default: []
    },
    uploaded_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
},{
    timestamps: true
})

module.exports = mongoose.model('Resource', ResourceSchema)


