const express = require("express");
const router = express.Router();
const { User } = require("../models/users");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port:465,
    secure:true,
    auth: {
        user: 'prashant.04766@gmail.com',
        pass: 'qlfienxbsj29384dsk'
    }
});

router.post("/verify",async (req,res)=>{
    let user = await User.findOne({email:req.body.email},(err)=>console.log(err,"err-----------"))
    res.send(user)
})


router.post("/sendOTP",async (req,res)=>{
    console.log("opt------------------",req.body)
    let mailOptions = {
        from: `"Prashant Tomar"<prashant.04766@gmail.com>`,
        to: req.body.email,
        subject: `Reset Password`,
        text: `Confirmation Code for Resetting the password ${req.body.opt}, the Code will expire in 10min`
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
})

router.post("/new",async (req,res)=>{
    console.log(req.body)
    const salt = await bcrypt.genSalt(10);
    let user = User.findOneAndUpdate({email:req.body.email},
        {password:await bcrypt.hash(req.body.password, salt)},()=>{
            console.log("-------------------------")
        })
    
    res.send("OK")
    

})

module.exports = router;