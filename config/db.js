const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

// create a mongoDB connection
 async function mongoDBConnect() {
    try {
        const DB = process.env.MONGO
        const connect = await mongoose.connect(DB);
        console.log(`mongonDB connection set successfully HOST : ${connect.connection.host}`.yellow);
    } catch (error) {
        console.log(error);
    }
}

module.exports ={ mongoDBConnect}