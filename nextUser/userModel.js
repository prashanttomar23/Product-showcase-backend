const mongoose = require('mongoose');

const NextUser = mongoose.model('NextUser', new mongoose.Schema({
  name: {
    type: String,
    required: true, 
    maxlength: 50,
    unique:true
  },
  email: { 
    type: String, 
    required: true,
    min: 0
  },
  role:{
    type:String,
    required:true,
  },
  //-----------image need to b updated---
  image:{
      data:Buffer,
      contentType:String,
    
  }
  //--------------------
}));


 
exports.NextUser = NextUser; 
