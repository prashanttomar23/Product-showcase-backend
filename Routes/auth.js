const Joi = require('joi');
const bcrypt = require('bcrypt');
const {User} = require('../models/users');
const express = require('express');
const router = express.Router();


// router.use(express.json());
// router.use(express.urlencoded({extended:false}));
router.post('/', async (req, res) => {
    //console.log(req.body)
    const { error } = validate(req.body); 
    if (error) return res.send("401");
    let user= await User.findOne({email:req.body.email});
    if(!user) return res.send("400")
    const validPassword= await bcrypt.compare(req.body.password,user.password)
    if(validPassword){
//-------------auth token generator in user model----
        //const token= user.generateAuthToken();
        res.send(user)
    }
    else{
        res.send("401")
    }
    
});

function validate(req) {
    const schema = {
      email: Joi.string().min(8).required().email(),
      password: Joi.string().min(8).required()
    };
  
    return Joi.validate(req, schema);
  }

module.exports = router; 
  