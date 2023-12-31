const mongoose = require('mongoose');

// create schema
const transactionSchema = new mongoose.Schema(
    {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "user",
            required : true,
        },
        transType : {
            type :String ,
            required : true,
            enum : ["Income", "Expense"]
        },
        amount : {
            type: Number,
            required : true
        },
        expense_cat : {
            type : String,
        },
        income_type : {
            type : String,
            enum: ["Salary", "Bonus", "Overtime", "Others","Get Loan"]
        },
        transDate: {
            type : String,
            required : true
        }
    },
    {
        timestamps :true
    }
);



const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports  = Transaction;
