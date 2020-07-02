const express = require("express");
const mongoose = require("mongoose");
const app = express();
const {CurrentUser}= require("./models/currentUser");



// app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
}); 



const users = require('./routes/users');
const products=require('./routes/products');
const auth=require('./routes/auth');
const inventory=require('./routes/inventory');
const purchase=require('./routes/purchaseItems');
const resetPassword=require('./ResetPassword/resetPassword')
const nextUser= require('./nextUser/userRoutes')


app.use('/api/users', users);
app.use('/api/products',products);
app.use('/auth',auth);
app.use('/inventory',inventory);
app.use('/purchase',purchase);
app.use('/resetPassword',resetPassword);
app.use('/next/user',nextUser);

//app.use('/',express.static(__dirname + '/public'));




	



app.get('/',(req,res)=>{
    res.sendFile(__dirname + "/public/index.html")
})
//--make sure to change username and password in connection string
mongoose.connect('mongodb+srv://<USERNAME>:<PASSWORD>@clustermeg-dkebi.mongodb.net/test?retryWrites=true&w=majority',({useNewUrlParser: true,
useUnifiedTopology: true}))
    .then(()=> console.log("connected"))
    .catch(err=> console.log("not connected"))

app.get('/currentuser',async(req,res)=>{
    const currentUser = await CurrentUser.find()
    res.send(currentUser);
    
})
app.get('/deleteuser',async(req,res)=>{
    const result= await CurrentUser.findOneAndRemove({ user: "CurrentUser" })
    res.send("ok")
    
})

app.listen("8080");