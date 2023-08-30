//routes/index.js
const express = require("express");
const router = express.Router();

const post_controller = require("../controllers/postController");

router.get("/", post_controller.index);
router.post("/add", post_controller.index_post);
router.post("/delete/:id", post_controller.delete_post);
router.post("/sign-up", async (req, res, next) => {
    // Handle your sign-up logic here
});
router.post("/log-in", (req, res, next) => {
    // Handle your log-in logic here
});
app.get("/log-out", (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
});
module.exports = router;