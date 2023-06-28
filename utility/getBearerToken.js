
 const getBearerToken = (request) => {

    const authUser = request.headers.authorization 

    if(!authUser) return false;

    // Extract the token from the authorization header
    const token = authUser?.replace('Bearer ', '');

    return token
}
module.exports = {
    getBearerToken,
}