const express = require('express');
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const { MongoMemoryServer } = require('mongodb-memory-server');
const profilesRouter = require('./route/user');
const commentsRouter = require('./route/comment');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


let server;

async function startServer() {
    // Start the in-memory MongoDB server
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Connect to the in-memory MongoDB server
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    console.log(`MongoDB successfully connected to ${mongoUri}`);

    // Define your routes and models here
    // For example:
    const usersRouter = require('./route/user');
    const commentsRouter = require('./route/comment');
    app.use('/', usersRouter);
    app.use('/', commentsRouter);

    // Start the server
    server = app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
        await mongoose.connection.close();
        await mongoServer.stop();
        console.log('MongoDB disconnected and server stopped');
        process.exit(0);
    });
}
function getServer() {
    return server; // Return the server instance
}

// Call the function to start the server
module.exports = { app, startServer, getServer };
