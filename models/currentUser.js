const Joi = require('joi');
const mongoose = require('mongoose');

const CurrentUser = mongoose.model('CurrentUser', new mongoose.Schema({
  user:{
    type:String,
    unique:true,
    required:true

  },
  name: {
    type: String,
    required: true, 
    maxlength: 50,
    unique:true
  },
  role:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  }
  //--------------------
}));

function validateMovie(currentUser) {
  const schema = {
    user:Joi.string().required(),
    name: Joi.string().max(50).required(),
    role:Joi.string().required()
  };

  return Joi.validate(currentUser, schema);
}

exports.CurrentUser = CurrentUser; 
exports.validate = validateMovie;