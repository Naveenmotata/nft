const express = require("express");
const User = require("../models/user");
const router = express.Router();

// Sign Up Route
router.get("/", (req, res) => {
    res.render("users/signup"); // Correctly render the signup view
});

// Handle Sign Up Submission
router.post("/", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = await User.register(new User({ username, email }), password);
        req.flash("success", "Registration successful! Please log in.");
        res.redirect("/login");
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
});

module.exports = router;


