const express = require("express");
const { createMusic, getAllMusic } = require("../controllers/music.controller");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.post("/musics",authMiddleware, createMusic);
router.get("/musics",authMiddleware, getAllMusic);

module.exports = router;
