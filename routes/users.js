// routes/users.js
const express = require("express");
const router = express.Router();
const passport = require("../passport-config"); // Import Passport
const bcrypt = require("bcryptjs");
const User = require("../models/user.js");
const user_controller = require("../controllers/userController"); // Import your User model

router.get("/", user_controller.index);

router.post("/sign-up", async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            password: hashedPassword
        });
        const result = await user.save();
        res.redirect("/");
    } catch (err) {
        return next(err);
    }
});

router.post("/log-in", (req, res) => {
    passport.authenticate("local", {
        successRedirect: `/${req.body.username}`,
        failureRedirect: "/"
    })(req, res);
});

router.post("/log-out", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

module.exports = router;
