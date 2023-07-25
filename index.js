const express = require("express");
const session = require("express-session");
const app = express();
const port = 5000;
const cors = require("cors")

const path = require("path");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
app.use(cors());
require("dotenv").config()

app.set("view engine", "ejs");
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_KEY,
      callbackURL:"http://localhost:5000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);
passport.serializeUser(function (user,cb)  {
  cb(null, user);
});
passport.deserializeUser((obj,cb) => {
  cb(null, obj);
});

app.get("/login", (req, res) => {
  res.render("index.ejs");
});

app.get("/dashboard",(req,res)=>{
    if (req.isAuthenticated()) {
      res.render("dashboard.ejs",{
        user:req.user._json
      });
    //   console.log(req.user._json)
      
    }
    else{
        res.redirect("/login")
    }
})

app.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err) {console.log(err)}
        else{
            res.redirect("/login");
        }
    })
})





app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",passport.authenticate("google",{failureRedirect:("/login")}),(req,res)=>{
    res.redirect("/dashboard")
})

app.listen(port);
