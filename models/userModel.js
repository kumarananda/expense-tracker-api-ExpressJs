const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")

const userSchema = mongoose.Schema({

    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique :true,
    },
    password : {
        type : String,
        required : true,
        trim : true
    },
    categories : {
        type : Array,
        required : true,
    },
    isAdmin : {
        type : Boolean,
        default : false
    },
},
{
    timestamps : true
})



const User = mongoose.model('User', userSchema);

module.exports  = User;
