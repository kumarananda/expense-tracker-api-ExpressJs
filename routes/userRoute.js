const express = require('express');
const { registerUser, getAllUsers, getSingleUser, userLogin, addNewExpCat  } = require('../controllers/userController');
const checkLogedInAuth = require('../utility/checkLogedInAuth');

// router init 
const router = express.Router();






router.post('/',   registerUser)
router.get('/',   getAllUsers)
router.get('/:id', checkLogedInAuth, getSingleUser )

router.post('/login',  userLogin )

router.patch('/cate-update/:id', checkLogedInAuth, addNewExpCat )







module.exports = router