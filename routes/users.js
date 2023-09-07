// routes/users.js
const express = require("express");
const router = express.Router();
const passport = require("../passport-config"); // Import Passport
const bcrypt = require("bcryptjs");
const User = require("../models/user.js");

const user_controller = require("../controllers/userController"); // Import your User model
const post_controller = require("../controllers/postController");

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
        successRedirect: "/index",
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

router.get("/index", post_controller.index);
router.post("/index/add", post_controller.index_post);
router.post("/index/delete/:id", post_controller.delete_post);

router.post("/index/sendRequest/:id", user_controller.sendRequest);
router.post("/index/cancelRequest/:id", user_controller.cancelRequest);
router.post("/index/rejectRequest/:id", user_controller.rejectRequest);
router.post("/index/deleteFriend/:id", user_controller.deleteFriend);

module.exports = router;
