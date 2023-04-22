//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 11;

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
    const password = (req.body.password);
    User.findOne({email : username})
    .then(user => {
        if (!user){
            console.log("No User Found!!!");
            res.redirect("/login");
        }
        else if (user){
            bcrypt.compare(password, user.password, function(err, result) {
                if (result == true) {
                    res.render("secrets");
                }else{
                    res.redirect("/login");
                }
          });

        }      
})
});




app.route("/register")

.get((req, res) => {
    res.render("register");
})

.post((req, res) =>{

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const newUser = new User({
            email : req.body.username,
            password: hash
        })
        newUser.save()
        .then(result => {
            console.log(result);
            res.render("secrets");
        })
        .catch(err => {
            console.log("Error: "+ err)
        });
        

    });


});








app.listen(3000, () => {
    console.log("Server started successfully at :3000");
});


