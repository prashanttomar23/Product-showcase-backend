const mongoose = require('mongoose');


const InventoryItem=new mongoose.Schema({
    name:{
        type:String
    } ,
     price: {
         type:Number
     },
     companyTitle: {
         type:String
     }
     , quantity: {
         type:Number
     }
})

const BillInfo =  new mongoose.Schema({
    cardID: {
        type:String
    },
    mobileNumber:{
        type:Number
    },
    purchasedTime:{
        type:String
    },
    paymentMethod:{
        type:String
    },
    email:{
        type:String
    },
    totalAmount:{
        type:Number
    },
    items: {
        type: [InventoryItem]
    }
})

const Bill= mongoose.model('Bill',BillInfo)

exports.Bill = Bill; 
