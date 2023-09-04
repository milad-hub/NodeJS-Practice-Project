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

const UserStatsAggregateOptions = [
    {
        $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            totalActiveUsers: {
                $sum: {
                    $cond: { if: { $eq: ["$isActive", true] }, then: 1, else: 0 }
                }
            },
            maxAge: { $max: "$age" },
            minAge: { $min: "$age" },
            avgAge: { $avg: "$age" }
        }
    },
    {
        $project: {
            totalUsers: 1,
            totalActiveUsers: 1,
            maxAge: 1,
            minAge: 1,
            avgAge: { $round: ["$avgAge", 2] }
        }
    }
];

const User = mongoose.model('users', userSchema);

module.exports = {
    User,
    UserStatsAggregateOptions
};
