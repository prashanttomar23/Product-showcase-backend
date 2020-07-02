
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
     },
     stock:{
         type:Number
     }
})

const User =  new mongoose.Schema({
    user: {
        type: String
    },
    role:{
        type:String
    },
    email:{
        type:String
    },
    inventoryItems: {
        type: [InventoryItem]
    }
})

const Inventory= mongoose.model('inventory',User)

exports.Inventory = Inventory; 
