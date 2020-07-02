const express = require("express");
const router = express.Router();
const { Bill } = require("../models/bill")


router.post('/', async (req, res) => {
    //console.log(req.body, "obdy here")
    let bill = new Bill
    bill.cardId = req.body.cardId
    bill.mobileNumber = parseInt(req.body.mobileNumber)
    bill.purchasedTime = req.body.purchasedTime
    bill.paymentMethod = req.body.paymentMethod
    bill.email = req.body.email
    bill.items = req.body.data
    bill.totalAmount=req.body.totalAmount
    let pr=await bill.save();
    if(pr) res.send("OK")
    else res.send("NOT")
    
})

router.post('/getbills',async (req,res)=>{
    //console.log(req.body,"body here")
    let bills = await Bill.find({email:req.body.email})
    res.send(bills)
})


module.exports = router;