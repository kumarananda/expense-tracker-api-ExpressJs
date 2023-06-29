
const { mongoDBConnect } = require("../config/db");
const User = require("../models/userModel");
const createError = require("../utility/createError");
const { getBearerToken } = require("../utility/getBearerToken");
const { verifyPassword, hashPassword } = require("../utility/hash");
const { tokenVerify, createJwtToken } = require("../utility/token");
const { validateEmail } = require("../utility/validate");

// get all users
const getAllUsers = async (req, res, next) => {
    // mongoDBConnect()
    
    const users = await User.find()

    res.status(200).send({users})
}



/**
 * /api/user/:id & header
 * @param {GET} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const getSingleUser = async (req, res, next) => {

    try {
        const {id} = req.params;

        const userData = await User.findById(id)   

        if(!userData){
           return next(createError(404, "User not found"))
        }

        // skip some keys
        const {...user} = userData._doc;

        if(userData){
            res.status(200)
            .json(
                {
                    message: "User get successful",
                    user 
                }
            )
        }

    } catch (error) {
        next(error);
    }

}
/**
 * /api/user/login 
 * @method {POST} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const userLogin = async (req, res, next) => {

    try {
        const {email, password: pass } = req.body;

        if(!email){
          return  next(createError(404, "Email is required"))
        }
        if(!pass){
          return  next(createError(404, "Password is required"))
        }


        const userData = await User.findOne({email});

        if(!userData){
           return  next(createError(404, "User not found"))
        }

        if(!verifyPassword(pass, userData.password)){
            return next(createError(404, "Password not match"))
        }

        const token = createJwtToken( {id : userData._id, isAdmin : userData.isAdmin })

        // skip some keys
        const { password, ...user} = userData._doc;



        const ExpireInMin = 60*24;
        if(user){
            res.status(200)
            .cookie('accessToken', token, { expires: new Date(Date.now() + 1000*60* ExpireInMin)})
            .json(
                {
                    message: "User get successful",
                    user 
                }
            )
        }

    } catch (error) {
        next(error);
    }

}


/**
 * 
 * @param {*} req Post
 * @param {*} res 
 * @param {*} next 
 * @returns User
 */

const registerUser = async (req, res, next) => {

    try {

        console.log(req.body);
        const {name , email, password } = req.body

        
        if(!email) throw new Error("Plseae enter email")
        if(!name) throw new Error("Plseae enter your name")

        if(!password) throw new Error("Plseae enter Password")

        if(!validateEmail(email)) throw Error("Please enter valid email")
        
        // Check Duplicate email
        if(email){
            const dup = await User.findOne({email: email})
            if(dup) throw new Error("Email already exists")
        }
        

        // default cats,
        const categories = ["House Rent", "Water Bill", "Electric Bill", "Groceries", "Uber", "Medications" ];

        const hash = hashPassword(password)
        const newData = {name , email, password: hash, categories:categories};

  
        // send new user on db
        const createUser = await User.create(newData);

        if(!createUser?._id) throw new Error("Network Error")


        const token = createJwtToken({id : createUser._id, isAdmin : createUser.isAdmin });

        // skip some keys
        const {...user} = createUser._doc;



        const ExpireInMin = 60*24;
        if(user){
            res.status(200)
            .cookie('accessToken', token, { expires: new Date(Date.now() + 1000*60* ExpireInMin)})
            .json(
                {
                    message: "User created successful",
                    user 
                }
            )
        }

    } catch (error) {
        next(error);
    }

}

/**
 * /api/user/cate-update/:id
 * @param {GET} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const addNewExpCat = async (req, res, next) => {

    try {
        const {id} = req.params;
        const {category} = req.body;
        
        if(!category){
            return next(createError(404, "Please enter category name"))
        }
        const findUser = await User.findById(id)

        if(!findUser){
            return next(createError(404, "User not found"))
        }

        // check duplicte category
        const checkDupCat = findUser.categories.find(element =>  element.toLowerCase() === category.toLowerCase())

        if(checkDupCat) {
            return next(createError(404, "Category already exist"))
        } 

        findUser.categories.push(category)

        // send new user on db
        const updateUser = await User.findByIdAndUpdate(id, {categories: findUser.categories}, {new: true});
 
        if(!updateUser){
            return next(createError(404, "Data Update Faild"))
        }

        // skip some keys
        const {password, ...user} = updateUser._doc;


        res.status(200)
        .json(
            {
                message: "Category successful",
                user 
            }
        )
     

    } catch (error) {
        next(error);
    }

}


module.exports = {
    registerUser,
    getAllUsers,
    getSingleUser,
    userLogin,
    addNewExpCat,
}