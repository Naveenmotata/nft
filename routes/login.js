const express = require("express");
const passport = require("passport");
const router = express.Router();
const{ saveRedirectUrl}=require("../middleware");

// Render the login form (GET)
router.get("/", (req, res) => {
    res.render("users/login"); // Adjust the path based on your structure
});

// Handle login form submission (POST)
router.post("/",saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}), async(req, res) => {
    req.flash("success", "Welcome back!");
    let redirectUrl=res.locals.redirectUrl ||"/products" ;
    res.redirect(redirectUrl); // Redirect to home or dashboard after successful login
});

// Handle logout (GET)
router.get("/logout", (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out");
        res.redirect("/products");
    });
});

module.exports = router;




