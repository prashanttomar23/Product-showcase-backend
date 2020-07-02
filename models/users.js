const jwt = require("jsonwebtoken");
const Joi = require('joi');
const mongoose = require('mongoose');
const userSchema= new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email:{
    type:String,
    required:true,
    minlength:8,
    maxlength:100, 
    unique:true
},
  password:{
      type:String,
      required:true,
      minlength:8,
  },
  role:{
    type:String,
    required:true,
  }
});
userSchema.methods.generateAuthToken=function() {
  const token=jwt.sign({_id:this._id,role:this.role},"keyPrivateJwt")
  return token;
}
const User = mongoose.model('User',userSchema);

validateUser=(user)=>{
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(8).max(100).required(),
    password:Joi.string().min(8).required(),
    role: Joi.string().required(),
  };

  return Joi.validate(user, schema);
}

exports.User = User; 
exports.validate = validateUser;
