const express = require('express');
const { registerUser, getAllUsers, getSingleUser, userLogin, addNewExpCat  } = require('../controllers/userController');

// router init 
const router = express.Router();
const { tokenVerify } = require('../utility/token');
const { getBearerToken } = require('../utility/getBearerToken');
const createError = require('../utility/createError');

const checkLogedInAuth = async (req, res, next) => {

  try {
    const params = req.params;
    const authToken = getBearerToken(req)

    const tokenCheck = tokenVerify(authToken)

    console.log(params.id);
    console.log(tokenCheck);

    if(!tokenCheck.id || !params.id ){
       return next(createError(401, "Authorization Faild"))
    }

    if(tokenCheck.id !== params.id ){
       return next(createError(401, "Authorization Faild"))
    }

    return next()

  } catch (error) {
      next(error);
  }

}





router.post('/',   registerUser)
router.get('/',   getAllUsers)
router.post('/login',  userLogin )

router.patch('/cate-update/:id', checkLogedInAuth, addNewExpCat )
router.get('/:id', checkLogedInAuth, getSingleUser )






module.exports = router