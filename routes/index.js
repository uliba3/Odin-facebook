//routes/index.js
const express = require("express");
const router = express.Router();

const post_controller = require("../controllers/postController");

router.get("/", post_controller.index);
router.post("/add", post_controller.index_post);
router.post("/delete/:id", post_controller.delete_post);

module.exports = router;