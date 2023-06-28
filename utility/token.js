
const jwt =  require('jsonwebtoken');


/**
 * create jwt token
 * @param {*} payload 
 * @param {*} expire 
 * @returns 
 */
const createJwtToken = (payload, expire = "7d") => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn : expire});
    console.log(token);
    return token

}

/**
 * verify jwt token
 * @param {*} token 
 * @returns 
 */
const tokenVerify = (token) => {
    try {
        const verify = jwt.verify(token, process.env.JWT_SECRET);
        return verify
    } catch (error) {
        return error
    }

    
}

module.exports = {
    createJwtToken,
    tokenVerify
};
