const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    id: {
        type: String,
        select: false
    },
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
        required: true,
        validate: {
            validator: function (value) {
                return value >= 18 && value <= 100;
            },
            message: 'Age must be between 18 and 100'
        }
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
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }

},
    { toJSON: { virtuals: true } });

userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// this is just for testing pre method
userSchema.pre('save', function (next) {
    this.createdAt = new Date();
    next();
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

const UserAgeAggregateOptions = (age) => [
    {
        $match: {
            age: age
        }
    },
    {
        $sort: { lastName: 1 }
    },
    {
        $addFields: {
            fullName: { $concat: ["$firstName", " ", "$lastName"] },
            age: "$age",
            email: "$email",
            hobbies: "$hobbies"
        }
    },
    {
        $project: {
            _id: 0,
            fullName: 1,
            age: 1,
            email: 1,
            hobbies: 1
        }
    }
];

const User = mongoose.model('users', userSchema);

module.exports = {
    User,
    UserStatsAggregateOptions,
    UserAgeAggregateOptions
};
