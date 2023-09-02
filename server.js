require('dotenv').config({ path: './config.env' });

const app = require('./app/app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});