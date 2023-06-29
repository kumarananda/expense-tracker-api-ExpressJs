const { mongoDBConnect } = require("../config/db");
const Transaction = require("../models/transctionModel");
const createError = require("../utility/createError");



const createTransaction = async (req, res, next) => {
    await mongoDBConnect()


    const {id} = req.params;
    const { amount, transType, transDate, category, expense_cat, income_type} = req.body;

    try {
        
        if(!amount)return next(createError(404, "Please Enter amonut"));
        if(!transType)  return next(createError(404, "Select transaction type"));
        
        if(!transDate) return next(createError(404, "Select transaction date"));
        

        let transData;
        if(transType=== "Expense") {
            if(!expense_cat) {
                return next(createError(404, "Select expense category")); 
            }else {
                transData = {userId:id, amount, transType, transDate, expense_cat }
            }
            
        }else if(transType === "Income"){
            if(!income_type){
                return next(createError(404, "Select income type"));
            }else{
                transData = {userId:id, amount, transType,  transDate, income_type }
            }
        }

        const transaction = await Transaction.create(transData);

        if(!transaction)
            return next(createError(404, "Transaction add faild"));
        
        // 
        res.status(200).send({transaction, message:"Transaction Create Succssful"})

    } catch (error) {
        next(error);
    }

}

const getAllTransactions = async (req, res, next) => {
    await mongoDBConnect()

    try {

        const transactions = await Transaction.find();

        if(!transactions){
            next(createError(400, "Transaction not found"))
        }

        res.status(200).send({transactions, message:"Transactions Get Succssful"})

    } catch (error) {
        next(error);
    }

}


const getUserTransactions = async (req, res, next) => {
    await mongoDBConnect()

    const {id} = req.params;

    try {

        const userTransactions = await Transaction.find({userId:id})
        
        if(!userTransactions ) return next(createError(404, "Transaction not found"));

        // 
        res.status(200).send({userTransactions, message:"Transactions Get Succssful"})

    } catch (error) {
        next(error);
    }

}

const getUserSingleTransaction = async (req, res, next) => {
    await mongoDBConnect()

    const {trensId } = req.params;

    try {

        const transaction = await Transaction.findById(trensId)
        
        if(!transaction ) return next(createError(404, "Transaction not found"));

        // 
        res.status(200).send({transaction, message:"Transaction Get Succssful"})

    } catch (error) {
        next(error);
    }

}


const updateUserSingleTransaction = async (req, res, next) => {
    await mongoDBConnect()

    const {trensId } = req.params;
    const data = req.body

    try {

        const transaction = await Transaction.findByIdAndUpdate(trensId, {...data},{new:true} )
        
        if(!transaction ) return next(createError(404, "Transaction not found"));

        // 
        res.status(200).send({transaction, message:"Transaction Update Succssful"})

    } catch (error) {
        next(error);
    }

}

const deleteUserSingleTransaction = async (req, res, next) => {
    await mongoDBConnect()

    const {trensId } = req.params;

    try {
        const transaction = await Transaction.findByIdAndDelete(trensId )
        // const transaction = await Transaction.findById(trensId )
        
        if(!transaction ) return next(createError(404, "Transaction not found"));

        // 
        res.status(200).send({transaction, message:"Transaction Delete Succssful"})

    } catch (error) {
        next(error);
    }

}











module.exports = { 
    createTransaction, 
    getAllTransactions,
    getUserTransactions, 
    getUserSingleTransaction, 
    updateUserSingleTransaction,
    deleteUserSingleTransaction,
}