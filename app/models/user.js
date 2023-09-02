const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    hobbies: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        default: false,
        required: true,
        select: false
    }

});

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
