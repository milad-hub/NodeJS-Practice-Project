require('dotenv').config({ path: './config.env' });

const app = require('./app/app');
const PORT = process.env.PORT || 3000;
let server;

const startServer = () => {
    return app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

const handleUnhandledRejection = (reason, promise) => {
    console.log(`Unhandled Rejection at => Promise: ${promise} - reason: ${reason}`);
    restartServer();
};

const handleUncaughtRejection = (err) => {
    console.log(`Uncaught Exception: ${err}`);
    restartServer();
};

const restartServer = () => {
    server.close(() => {
        server = startServer();
        console.log(`Server is restarted on port ${PORT}`);
    });
};

process
    .on('unhandledRejection', handleUnhandledRejection)
    .on('uncaughtException', handleUncaughtRejection);

server = startServer();