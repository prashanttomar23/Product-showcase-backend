const Joi = require('joi');
const mongoose = require('mongoose');

const Product = mongoose.model('Product', new mongoose.Schema({
  name: {
    type: String,
    required: true, 
    maxlength: 50,
    unique:true
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  companyTitle:{
    type:String,
    required:true,
  },
  stockAvailable:{
    type:Number,
    required:true,
    min: 0
  },
  //-----------image need to b updated---
  image:{
      data:Buffer,
      contentType:String,
    
  }
  //--------------------
}));

function validateProduct(product) {
  const schema = {
    name: Joi.string().max(50).required(),
    price: Joi.number().min(0).required(),
    companyTitle: Joi.string().required(),
    image:Joi.string(),
    stockAvailable: Joi.number().min(0),
  };

  return Joi.validate(product, schema);
}

exports.Product = Product; 
exports.validate = validateProduct;