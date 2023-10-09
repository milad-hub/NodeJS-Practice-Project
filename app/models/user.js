const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const saltRounds = bcrypt.genSaltSync(12);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z0-9]{4,}$/;

const role = {
    admin: "admin",
    user: "user"
};

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
    dateOfBirth: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                const currentDate = new Date();
                const userDate = new Date(value);
                const age = currentDate.getFullYear() - userDate.getFullYear();
                return age >= 18 && age <= 100;
            },
            message: 'Age must be between 18 and 100'
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                return emailRegex.test(value) && !value.includes('+');
            },
            message: 'Invalid email format'
        }
    },
    role: {
        type: String,
        enum: Object.values(role),
        default: role.user
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                return usernameRegex.test(value);
            },
            message: 'Username must be at least 4 characters long and contain only letters and numbers'
        }
    },
    password: {
        type: String,
        required: true,
        select: false,
        minlength: [8, 'Password must be at least 8 characters long'],
        maxlength: [32, 'Password cannot be longer than 32 characters']
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (value) {
                return value === this.password;
            },
            message: 'Passwords do not match'
        }
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
        default: Date.now
    }

},
    { toJSON: { virtuals: true } });

userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) { return next(); }
    this.password = await bcrypt.hash(this.password, saltRounds);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.comparePassword = async function (userPassword, candidatePassword) {
    return await bcrypt.compare(userPassword, candidatePassword);
};

////////////////////////////////////////////////////////////////////////////

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
            _id: 0,
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
    role,
    User,
    UserStatsAggregateOptions,
    UserAgeAggregateOptions
};
