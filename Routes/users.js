const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/users");
const { CurrentUser } = require("../models/currentUser");
const bcrypt = require("bcrypt");
const request = require("superagent");
const auth = require("../middleware/auth");
const axios = require("axios");
const passport = require("passport");
const GithubStrategy = require("passport-github").Strategy;
// let user ={};

// passport.serializeUser((user,cb)=>{
//     cb(null,user);
// })
// passport.deserializeUser((user,cb)=>{
//     cb(null,user);
// })
// passport.use(new GithubStrategy({
//     clientID:"80e1c2081bb4edae9d50",
//     clientSecret:"e27924a502c882793731176c47bfecb3695935f8",
//     callbackURL:"/auth/github/callback"
// },(accessToken,refreshToken,profile,cb)=>{
//     console.log(JSON.stringify(profile))
//     user={...profile}
//     return cb(null,profile)
// }
// ));
// router.get("/auth/github",passport.authenticate("github"));
// router.get("auth/github/callback",passport.authenticate(("github",(req,res)=>{
//     res.redirect("/profile");
// })))
let accessToken = null;

router.get("/user/Github/callback", (req, res, next) => {
    //console.log(req.query, "from github")
    let codeM = req.query.code;
    console.log(codeM, "code here");
    if (codeM) {
        request
            .post("https://github.com/login/oauth/access_token")
            .send({
                client_id: "80e1c2081bb4edae9d50",
                client_secret: "e27924a502c882793731176c47bfecb3695935f8",
                code: codeM,
            })
            .set("Accept", "application/json")
            .then(function (result) {
                const data = result.body;
                accessToken = data.access_token;
                console.log(accessToken, "data here");
                res.redirect("http://localhost:8080/api/users/user/");
            });
    }
});
router.get("/user", (req, res, next) => {
    axios
        .get("https://api.github.com/user", {
            headers: {
                Authorization: `token ${accessToken} `,
            },
        })
        .then((result) => {
            if (result.data.login !== undefined) {
                //console.log(result.data);
                if (CurrentUser.findOne({ user: "CurrentUser" })) {
                    CurrentUser.findOneAndRemove({ user: "CurrentUser" }, () => {
                        let currentUser = new CurrentUser({
                            user: "CurrentUser",
                            name: result.data.login,
                            email: String(result.data.id),
                            role: "User",
                        });
                        currentUser.save();
                        console.log("done");
                    });
                }
                else {
                    let currentUser = new CurrentUser({
                        user: "CurrentUser",
                        name: result.data.login,
                        email: String(result.data.id),
                        role: "User",
                    });
                    currentUser.save();
                }
                res.redirect("http://localhost:3000/products");
            } else {
                res.redirect("http://locahost:3000");
            }
        });
});
// router.use(express.json());
// router.use(express.urlencoded({extended:false}));
router.get("/", async (req, res) => {
    const user = await User.find().sort("name");
    res.send(user);
});

//------registering user code---------

router.post("/", async (req, res) => {
    console.log(req.body);
    const { error } = validate(req.body);
    if (error) return res.send("400");
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.send("401");
    const salt = await bcrypt.genSalt(10);
    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, salt),
        role: req.body.role,
    });
    await user.save();
    const token = user.generateAuthToken();
    res.header("x-auth-token", token).send("200");
});

router.put("/:id", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        },
        { new: true }
    );
    if (!user) return res.status(404).send("The user was not found.");
    res.send(user);
});

router.delete("/:id", async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id);

    if (!user) return res.status(404).send("The user not found.");

    res.send(user);
});

router.get("/me", async (req, res) => {
    const user = await User.findById(req.params.id);
    res.send(user, "-----------------------------------user here");
});

module.exports = router;
