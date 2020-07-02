const express = require("express");
const router = express.Router();
const { NextUser } = require("./userModel");
const multer = require('multer');
const path = require('path');
const fs = require("fs");

// const storage = multer.diskStorage({
//     destination: "./Nextuploads",
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + "_" + Date.now() +
//             path.extname(file.originalname));
//     }
// });
// const upload = multer({
//     storage: storage,
// }).single("userAvatar")

router.get('/', async (req, res) => {
    const user = await NextUser.find().sort('name');
    res.send(user);
});

router.post('/add', async(req, res) => {
    //console.log("helo",req.body)
    let bindata = new Buffer(req.body.data.split(",")[1],"base64")
    
    nextUser=await NextUser.findOneAndUpdate({name:"Prashant Tomar"},{image:{data:bindata,contentType:'image/png'}})
    res.send("ok")
    // nextUser = new NextUser({
    //     name: "Prashant Tomar",
    //     email: "prashant@gmail.com",
    //     role: "Admin",
    //     image: {
    //         data: bindata,
    //         contentType: "image/png"
    //     },
    // })
    // result = await nextUser.save();
    // res.send(nextUser)
    
    // upload(req,res,(err)=>{
    //     if(err){
    //         res.send("400")
    //     }
    //     else{
    //         console.log("from post")
    //         console.log(req,"-----------");
    //         res.send("got it dasd")
    //         // nextUser = new NextUser({ 
    //         //     name: "Prashant Tomar",
    //         //     email: "prashant@gmail.com",
    //         //     role :"Admin",
    //         //     image: {
    //         //         data:fs.readFileSync(req.file.path),
    //         //         contentType:"image/png"
    //         //     },
    //         //     stockAvailable:req.body.stockAvailable,

    //         // });

    //         // result =  nextUser.save();
    //         //res.redirect("http://localhost:3000/addProduct")       
    //     }
    // })
})
module.exports = router;