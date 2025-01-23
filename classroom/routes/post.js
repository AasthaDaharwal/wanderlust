const express = require("express");
const router = express.Router();

// Index - post
router.get("/", (req , res) => {
    res.send("GET for posts");
});

// show - post
router.get("/:id", (req , res) => {
    res.send("GET for post");
});

// post - post
router.post("/", (req , res) => {
    res.send("POST for post id");
});

// Delete - post
router.delete("/:id", (req , res) => {
    res.send("DELETE for post");
});




module.exports = router;