const express = require('express');
const { getAllTransactions, createTransaction, getUserTransactions,  updateUserSingleTransaction, getUserSingleTransaction, deleteUserSingleTransaction } = require('../controllers/transactionController');
const checkLogedInAuth = require('../utility/checkLogedInAuth');

// router init 
const router = express.Router();



router.get('/',   getAllTransactions)
router.post('/:id', checkLogedInAuth,  createTransaction)
router.get('/:id/', checkLogedInAuth, getUserTransactions )
router.get('/:id/:trensId', checkLogedInAuth, getUserSingleTransaction )

router.patch('/:id/:trensId', checkLogedInAuth, updateUserSingleTransaction )
router.delete('/:id/:trensId', checkLogedInAuth, deleteUserSingleTransaction )






module.exports = router