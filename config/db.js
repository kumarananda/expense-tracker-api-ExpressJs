// create a mongoDB connection
export const mongoDBConnect = async() => {
    try {
        const connect = await mongoose.connect(DB);
        console.log(`mongonDB connection set successfully HOST : ${ connect.connection.host }`.yellow);
    } catch (error) {
        console.log(error);
    }
}
