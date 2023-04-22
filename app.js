//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


const User = new mongoose.model("User", userSchema);

console.log(md5("123$"));
console.log(md5("123"));
console.log(md5("1234"));


app.get("/", (req, res) => {
    res.render("home");
});

app.get("/logout", (req, res) => {
    res.render("home");
});

//app.route("/login").get().post();



app.route("/login")

.get( (req, res) => {
    res.render("login");
})

.post((req, res) =>{
    const username = req.body.username;
    const password = md5(req.body.password);
    User.findOne({email : username})
    .then(user => {
        if (!user){
            console.log("No User Found!!!");
            res.redirect("/login");
        }
        else if (user.password === password){
            console.log(user);            res.render("secrets");
        }else {
            console.log("Invalid Password!!!");
            res.redirect("/login");
        }
    });
});




app.route("/register")

.get((req, res) => {
    res.render("register");
})

.post((req, res) =>{
    const newUser = new User({
        email : req.body.username,
        password: md5(req.body.password)
    });

    newUser.save()
    .then(result => {
        console.log(result);
        res.render("secrets");
    })
    .catch(err => {
        console.log("Error: "+ err)
    });
});








app.listen(3000, () => {
    console.log("Server started successfully at :3000");
});


