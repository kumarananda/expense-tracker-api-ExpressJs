const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

mongoose.set('strictQuery', true);

// ! uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION... 💥💥💥 Shouting down');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config()
const app = require('./app');
const { mongoDBConnect } = require('./config/db');

const DB = process.env.MONGO



const port =  5000;
const server = app.listen(port, () => {
    mongoDBConnect()
    console.log(`App running on port ${port}..`);
});



process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});