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

const DB = process.env.MONGO


// create a mongoDB connection
const mongoDBConnect = async() => {
    try {
        const connect = await mongoose.connect(DB);
        console.log(`mongonDB connection set successfully HOST : ${ connect.connection.host }`.yellow);
    } catch (error) {
        console.log(error);
    }
}

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