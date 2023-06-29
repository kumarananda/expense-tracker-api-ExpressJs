const createError = require("./createError");
const { getBearerToken } = require("./getBearerToken");
const { tokenVerify } = require("./token");

const checkLogedInAuth = async (req, res, next) => {

    try {
      const params = req.params;
      const authToken = getBearerToken(req)
  
      const tokenCheck = tokenVerify(authToken)
  
      console.log(params.id);
      console.log(tokenCheck);
  
      if(!tokenCheck.id ){
         return next(createError(401, "Authorization Expired"))
      }
      if( !params.id ){
        return next(createError(401, "User Authorization Error"))
      }
  
      if(tokenCheck.id !== params.id ){
         return next(createError(401, "Authorization Faild"))
      }
  
      return next()
  
    } catch (error) {
        next(error);
    }
  
  }
  
  module.exports = checkLogedInAuth