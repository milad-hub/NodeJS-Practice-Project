const mongoose = require('mongoose');

module.exports = async () => {
    try {
        const DATABASE_CONNECTION = process.env.DATABASE_CONNECTION;

        await mongoose.connect(DATABASE_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to the database');
    }
    catch (error) {
        console.log('Failed to connect to the database:', error);
    }
};
