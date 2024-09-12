const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'must provide name']
    },
    imageUrl: {
        type: String,
        default: 'https://github.com/shadcn.png'
    },
    role: {
        type: String,
        default: 'user'
    },
    email: {
        type: String,
        required: [true, 'must provide email'],
    },
    password: {
        type: String,
        // required: [true, 'must provide password'],
    },
    year: {
        type: Number
    },
    entry_number: {
        type: String
    },
    rating: {
        type: Number,
        default: 0
    },
    contributedResources: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource',
        default: []
    }],
    savedResources: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource',
        default: []
    }]
}, {
    timestamps: true
})

// Hash the password before saving
UserSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();

    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    next();
});


module.exports = mongoose.model('User', UserSchema)