const {Product, validate} = require('../models/products'); 
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const multer =require('multer');
const path = require('path');
const fs = require("fs");
const nodemailer = require("nodemailer");


let testAccount =  nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
    // host: 'smtp.ethereal.email',
    // port: 587,
    // auth: {
    //     user: 'ahmad41@ethereal.email',
    //     pass: '6sNebQMeNgnP8Mn9ZD'
    // }
    host: 'smtp.gmail.com',
    port:465,
    secure:true,
    auth: {
        user: '', //gmail id
        pass: ''//gmail passowrd
    }
});
//============image
const storage= multer.diskStorage({
    destination:"./uploads",
    filename: function(req,file,cb){
        cb(null,file.fieldname + "_" + Date.now()+
        path.extname(file.originalname));
    }
});
const upload = multer({
    storage:storage,
}).single("productImage")
//-----------------imgae funtion end---
router.post('/add',( req,res)=>{
    console.log(req,"----")
    upload(req,res,(err)=>{
        if(err){
            res.send("400")
        }
        else{
            console.log(req.body)
            console.log(req.file);
            product = new Product({ 
                name: req.body.productName,
                price: req.body.productPrice,
                companyTitle:req.body.productCompany,
                image: {
                    data:fs.readFileSync(req.file.path),
                    contentType:"image/png"
                },
                stockAvailable:req.body.stockAvailable,
        
            });
            //let popupMesg=product.name + "Added"
            product = product.save();
            res.redirect("http://localhost:3000/addProduct")
            
            //const prod=Product.find()
            //console.log(prod)
            //res.contentType('json')
            
        }
    })
})

router.get('/', async (req, res) => {
    const product = await Product.find().sort('name');
    res.send(product);
  });
  
router.post('/', async (req, res) => {
    console.log(req)
    upload(req,res,(err)=>{
        if(err){
            console.log("error",err)
        }
        else {
            console.log("file fron  multer",req
            )
        }
    })
    const { error } = validate(req.body); 
    if (error) return res.send("401");
    let product= await Product.findOne({name:req.body.name});
    if(product) return res.send("400")

    product = new Product({ 
        name: req.body.name,
        price: req.body.price,
        companyTitle:req.body.companyTitle,
        stockAvailable:req.body.stockAvailable,
        image: req.body.image,

    });
    product = await product.save();
    res.send(product);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body); 
    //console.log("eroro her",error,req.params.id)
    //console.log(req.body,"from server body req")
    if (error) return res.send("401")

    // let product= await Product.findOne({name:req.body.name});
    // if(product) return res.send('400')

    let product = await Product.findByIdAndUpdate(req.params.id,
        { 
            name: req.body.name,
            price: req.body.price,
            companyTitle:req.body.companyTitle,
            stockAvailable:req.body.stockAvailable,
        });
        //console.log(product,"product updated oen")
    res.send(product);
});

router.delete('/:id', async (req, res) => {
    console.log(req.params.id)
    const product = await Product.findByIdAndRemove(req.params.id);
    if (!product) return res.status(404).send('Product not found.');

    res.send(product);
    
});

router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).send('Product not found.');

    res.send(product);
});

router.post('/editStock',async(req,res)=>{
    const products = await Product.find().sort('name');
    //console.log(products)
    //console.log("----------------------",req.body)
    req.body.forEach(async element => {
        console.log(element,"elemetn here")
        const product= await Product.findOneAndUpdate({name:element.name},
            {
                stockAvailable:element.stock-element.quantity
            },(res)=>{
                if (element.stock-element.quantity < 10) {
                    let mailOptions = {
                        from: `"Prashant Tomar"<prashant.04766@gmail.com>`,
                        to: 'prashant.tomar@rapidops.com',
                        subject: `${element.name} stock is low`,
                        text: `${element.name} stock is on low,only ${element.stock-element.quantity} unit left.`
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                }
            }
        )   
        
    });

})
router.post('/getOne',async(req,res)=>{
    console.log(req.body,"-----")
    const product=await Product.findOne({name:req.body.name})
    res.send(product)
})

module.exports = router;