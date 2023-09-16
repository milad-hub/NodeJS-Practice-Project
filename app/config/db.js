require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');

module.exports = async () => {
    try {
        const DATABASE_ADDRESS = process.env.NODE_ENV === 'development' ? process.env.DATABASE_LOCAL : process.env.DATABASE;

        await mongoose.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to the database');
    }
    catch (error) {
        console.log('Failed to connect to the database:', error);
    }
};
